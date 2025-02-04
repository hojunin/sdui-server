import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetsService } from './widgets.service';
import { WidgetsResolver } from './widgets.resolver';
import { Widget } from './entities/widget.entity';
import { WidgetLayout } from './entities/widget-layout.entity';
import { WidgetRelation } from './entities/widget-relation.entity';
import { Layout } from '../layouts/entities/layout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Widget, WidgetLayout, WidgetRelation, Layout]),
  ],
  providers: [WidgetsResolver, WidgetsService],
  exports: [WidgetsService],
})
export class WidgetsModule {}
