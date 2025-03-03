import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SchemasService } from './schemas.service';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { Schema } from './entities/schema.entity';

@Controller('schemas')
export class SchemasController {
  constructor(private readonly schemasService: SchemasService) {}

  @Post()
  async create(@Body() createSchemaDto: CreateSchemaDto): Promise<Schema> {
    return await this.schemasService.create(createSchemaDto);
  }

  @Get()
  async findAll(): Promise<Schema[]> {
    return await this.schemasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Schema> {
    return await this.schemasService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchemaDto: Partial<CreateSchemaDto>,
  ): Promise<Schema> {
    return await this.schemasService.update(id, updateSchemaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.schemasService.remove(id);
  }
} 