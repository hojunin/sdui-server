import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { LayoutsService } from './layouts.service';
import { Layout, LayoutSection } from './entities/layout.entity';
import { CreateLayoutInput } from './dto/create-layout.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WidgetLayout } from '../widgets/entities/widget-layout.entity';
import { Widget, WidgetType } from '../widgets/entities/widget.entity';

@Resolver(() => Layout)
export class LayoutsResolver {
  constructor(
    private readonly layoutsService: LayoutsService,
    @InjectRepository(WidgetLayout)
    private readonly widgetLayoutRepository: Repository<WidgetLayout>,
    @InjectRepository(Widget)
    private readonly widgetRepository: Repository<Widget>,
  ) {}

  @Mutation(() => Layout)
  createLayout(
    @Args('createLayoutInput') createLayoutInput: CreateLayoutInput,
  ) {
    return this.layoutsService.create(createLayoutInput);
  }

  @Query(() => [Layout], { name: 'layouts' })
  findAll() {
    return this.layoutsService.findAll();
  }

  @Query(() => [Layout], { name: 'layoutTemplates' })
  findAllTemplates() {
    return this.layoutsService.findAllTemplates();
  }

  @Query(() => Layout, { name: 'layout' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.layoutsService.findOne(id);
  }

  @Query(() => Layout, { name: 'layoutByPath' })
  findByPath(@Args('path', { type: () => String }) path: string) {
    return this.layoutsService.findByPath(path);
  }

  @Query(() => [Layout], { name: 'layoutHistory' })
  getLayoutHistory(@Args('path', { type: () => String }) path: string) {
    return this.layoutsService.getLayoutHistory(path);
  }

  @Mutation(() => Boolean)
  removeLayout(@Args('id', { type: () => ID }) id: string) {
    return this.layoutsService.remove(id);
  }

  @Mutation(() => Layout)
  rollbackLayout(
    @Args('path', { type: () => String }) path: string,
    @Args('revision', { type: () => Number }) revision: number,
  ) {
    return this.layoutsService.rollbackToRevision(path, revision);
  }

  @Query(() => Layout, { name: 'previewLayout' })
  previewLayout(@Args('id', { type: () => ID }) id: string) {
    return this.layoutsService.previewLayout(id);
  }

  @ResolveField('widgetRelations', () => [WidgetLayout], { nullable: true })
  async getWidgetRelations(@Parent() layout: Layout) {
    const { id } = layout;
    // 기존 위젯 관계를 찾습니다
    const existingRelations = await this.widgetLayoutRepository.find({
      where: { layoutId: id },
      relations: ['widget'],
    });

    // 이미 관계가 있다면 그대로 반환
    if (existingRelations.length > 0) {
      return existingRelations;
    }

    // 새로운 관계인 경우에만 생성
    return this.widgetLayoutRepository.find({
      where: { layoutId: id },
      relations: ['widget'],
    });
  }

  @ResolveField()
  async sections(@Parent() layout: Layout) {
    // sections가 없을 경우 빈 배열 반환
    const sections = layout.sections || [];

    const getActiveWidgets = (section: LayoutSection) => {
      const widgetTypes = section.widgetTypes;
      if (!widgetTypes) return [];
      return widgetTypes.map(async (widgetType) => {
        // 해당 type의 활성화된 최신 위젯 찾기
        const widget = await this.widgetRepository.findOne({
          where: {
            type: widgetType as WidgetType,
            isActive: true,
          },
          order: {
            revision: 'DESC',
          },
        });
        return widget;
      });
    };

    // 각 섹션의 위젯들을 조회
    const sectionsWithWidgets = await Promise.all(
      sections.map(async (section) => {
        const widgets = await Promise.all(getActiveWidgets(section));

        // null 값 제거
        const activeWidgets = widgets.filter((w): w is Widget => w !== null);

        return {
          ...section,
          widgets: activeWidgets,
        };
      }),
    );

    return sectionsWithWidgets;
  }
}
