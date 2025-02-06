import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Widget } from './entities/widget.entity';
import { CreateWidgetInput } from './dto/create-widget.input';
import { UpdateWidgetInput } from './dto/update-widget.input';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(Widget)
    private readonly widgetRepository: Repository<Widget>,
  ) {}

  async create(createWidgetInput: CreateWidgetInput): Promise<Widget> {
    // 같은 이름의 활성화된 위젯이 있는지 확인
    const existingWidget = await this.widgetRepository.findOne({
      where: {
        name: createWidgetInput.name,
        isActive: true,
      },
      order: {
        revision: 'DESC',
      },
    });

    // 위젯 생성
    const widget = this.widgetRepository.create({
      ...createWidgetInput,
      revision: existingWidget ? existingWidget.revision + 1 : 1,
    });

    // 이전 위젯이 있다면 비활성화
    if (existingWidget) {
      await this.widgetRepository.update(existingWidget.id, {
        isActive: false,
      });
    }

    return await this.widgetRepository.save(widget);
  }

  async findAll(): Promise<Widget[]> {
    return await this.widgetRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Widget> {
    const widget = await this.widgetRepository.findOne({
      where: { id, isActive: true },
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

    // 새로운 리비전 생성
    const newWidget = this.widgetRepository.create({
      ...widget,
      ...updateWidgetInput,
      id: undefined,
      revision: widget.revision + 1,
    });

    // 이전 위젯 비활성화
    await this.widgetRepository.update(id, { isActive: false });

    // 새 위젯 저장
    return await this.widgetRepository.save(newWidget);
  }

  async remove(id: string): Promise<boolean> {
    await this.widgetRepository.update(id, { isActive: false });
    return true;
  }

  async findHistory(id: string): Promise<Widget[]> {
    const widgets = await this.widgetRepository.find({
      where: { id },
      order: {
        revision: 'DESC',
      },
    });

    if (!widgets.length) {
      throw new NotFoundException(`No history found for widget with ID ${id}`);
    }

    return widgets;
  }
}
