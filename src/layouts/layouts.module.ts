import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LayoutsService } from './layouts.service';
import { LayoutsResolver } from './layouts.resolver';
import { Layout } from './entities/layout.entity';
import { WidgetLayout } from '../widgets/entities/widget-layout.entity';
import { Widget } from '../widgets/entities/widget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Layout, WidgetLayout, Widget])],
  providers: [LayoutsResolver, LayoutsService],
  exports: [LayoutsService],
})
export class LayoutsModule {}
