import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Widget } from './entities/widget.entity';
import { CreateWidgetInput } from './dto/create-widget.input';
import { UpdateWidgetInput } from './dto/update-widget.input';
import { WidgetLayout } from './entities/widget-layout.entity';
import { WidgetRelation } from './entities/widget-relation.entity';
import { Layout } from '../layouts/entities/layout.entity';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(Widget)
    private readonly widgetRepository: Repository<Widget>,
    @InjectRepository(WidgetLayout)
    private readonly widgetLayoutRepository: Repository<WidgetLayout>,
    @InjectRepository(WidgetRelation)
    private readonly widgetRelationRepository: Repository<WidgetRelation>,
    @InjectRepository(Layout)
    private readonly layoutRepository: Repository<Layout>,
  ) {}

  async create(createWidgetInput: CreateWidgetInput): Promise<Widget> {
    const { layouts, children, ...widgetData } = createWidgetInput;

    // 같은 타입의 활성화된 위젯이 있는지 확인
    const existingWidgetType = await this.widgetRepository.findOne({
      where: {
        type: widgetData.type,
        isActive: true,
      },
      order: {
        revision: 'DESC',
      },
    });

    // 위젯 생성
    const widget = this.widgetRepository.create({
      ...widgetData,
      revision: existingWidgetType ? existingWidgetType.revision + 1 : 1,
    });

    // 이전 위젯이 있다면 비활성화
    if (existingWidgetType) {
      await this.widgetRepository.update(existingWidgetType.id, {
        isActive: false,
      });
    }

    const savedWidget = await this.widgetRepository.save(widget);

    // 레이아웃 관계 생성
    if (layouts?.length) {
      // 레이아웃 존재 여부 확인
      const layoutIds = layouts.map((layout) => layout.layoutId);
      const existingLayouts = await this.layoutRepository.find({
        where: layoutIds.map((id) => ({ id, isActive: true })),
      });

      const existingLayoutIds = existingLayouts.map((layout) => layout.id);
      const validLayouts = layouts.filter((layout) =>
        existingLayoutIds.includes(layout.layoutId),
      );

      // 유효하지 않은 레이아웃 경고
      const invalidLayouts = layouts.filter(
        (layout) => !existingLayoutIds.includes(layout.layoutId),
      );
      if (invalidLayouts.length > 0) {
        console.warn(
          `다음 레이아웃들이 존재하지 않거나 비활성화되어 있어 위젯 관계를 생성하지 않았습니다: ${invalidLayouts
            .map((l) => l.layoutId)
            .join(', ')}`,
        );
      }

      if (validLayouts.length) {
        const layoutRelations = validLayouts.map((layout) =>
          this.widgetLayoutRepository.create({
            widgetId: savedWidget.id,
            layoutId: layout.layoutId,
            sectionName: layout.sectionName,
            order: layout.order,
          }),
        );
        await this.widgetLayoutRepository.save(layoutRelations);
      }
    }

    // 자식 위젯 관계 생성
    if (children?.length) {
      const childRelations = children.map((child) =>
        this.widgetRelationRepository.create({
          parentWidgetId: savedWidget.id,
          childWidgetId: child.widgetId,
          order: child.order,
        }),
      );
      await this.widgetRelationRepository.save(childRelations);
    }

    return this.findOne(savedWidget.id);
  }

  async findAll(): Promise<Widget[]> {
    return await this.widgetRepository.find({
      where: { isActive: true },
      relations: ['layoutRelations', 'childRelations', 'parentRelations'],
    });
  }

  async findOne(id: string): Promise<Widget> {
    const widget = await this.widgetRepository.findOne({
      where: { id, isActive: true },
      relations: ['layoutRelations', 'childRelations', 'parentRelations'],
    });
    if (!widget) {
      throw new NotFoundException(`Widget with ID ${id} not found`);
    }
    return widget;
  }

  async update(
    id: string,
    updateWidgetInput: UpdateWidgetInput,
  ): Promise<Widget> {
    const widget = await this.findOne(id);
    const { layouts, children, ...widgetData } = updateWidgetInput;

    // 새로운 리비전 생성
    const newWidget = this.widgetRepository.create({
      ...widget,
      ...widgetData,
      id: undefined,
      revision: widget.revision + 1,
    });

    // 이전 위젯 비활성화
    await this.widgetRepository.update(id, { isActive: false });

    // 새 위젯 저장
    const savedWidget = await this.widgetRepository.save(newWidget);

    // 기존 관계 복사 및 업데이트
    if (layouts) {
      await this.widgetLayoutRepository.delete({ widgetId: id });
      const layoutRelations = layouts.map((layout) =>
        this.widgetLayoutRepository.create({
          widgetId: savedWidget.id,
          layoutId: layout.layoutId,
          sectionName: layout.sectionName,
          order: layout.order,
        }),
      );
      await this.widgetLayoutRepository.save(layoutRelations);
    }

    if (children) {
      await this.widgetRelationRepository.delete({ parentWidgetId: id });
      const childRelations = children.map((child) =>
        this.widgetRelationRepository.create({
          parentWidgetId: savedWidget.id,
          childWidgetId: child.widgetId,
          order: child.order,
        }),
      );
      await this.widgetRelationRepository.save(childRelations);
    }

    return this.findOne(savedWidget.id);
  }

  async remove(id: string): Promise<boolean> {
    const widget = await this.findOne(id);
    await this.widgetRepository.update(id, { isActive: false });
    return true;
  }

  async findHistory(id: string): Promise<Widget[]> {
    const widgets = await this.widgetRepository.find({
      where: { id },
      order: {
        revision: 'DESC',
      },
      relations: ['layoutRelations', 'childRelations', 'parentRelations'],
    });

    if (!widgets.length) {
      throw new NotFoundException(`No history found for widget with ID ${id}`);
    }

    return widgets;
  }

  async findByLayoutId(layoutId: string): Promise<Widget[]> {
    const layoutRelations = await this.widgetLayoutRepository.find({
      where: { layoutId },
      relations: ['widget'],
    });

    return layoutRelations.map((relation) => relation.widget);
  }

  async findByParentId(parentId: string): Promise<Widget[]> {
    const relations = await this.widgetRelationRepository.find({
      where: { parentWidgetId: parentId },
      relations: ['childWidget'],
    });

    return relations.map((relation) => relation.childWidget);
  }
}
