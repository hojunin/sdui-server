import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchemasController } from './schemas.controller';
import { SchemasService } from './schemas.service';
import { Schema } from './entities/schema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schema])],
  controllers: [SchemasController],
  providers: [SchemasService],
  exports: [SchemasService],
})
export class SchemasModule {} 