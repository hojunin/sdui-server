import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetsService } from './widgets.service';
import { WidgetsResolver } from './widgets.resolver';
import { Widget } from './entities/widget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Widget])],
  providers: [WidgetsResolver, WidgetsService],
  exports: [WidgetsService],
})
export class WidgetsModule {}
