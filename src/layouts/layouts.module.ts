import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LayoutsService } from './layouts.service';
import { LayoutsResolver } from './layouts.resolver';
import { Layout } from './entities/layout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Layout])],
  providers: [LayoutsResolver, LayoutsService],
  exports: [LayoutsService],
})
export class LayoutsModule {}
