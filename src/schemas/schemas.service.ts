import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schema } from './entities/schema.entity';
import { CreateSchemaDto } from './dto/create-schema.dto';

@Injectable()
export class SchemasService {
  constructor(
    @InjectRepository(Schema)
    private readonly schemaRepository: Repository<Schema>,
  ) {}

  async create(createSchemaDto: CreateSchemaDto): Promise<Schema> {
    const schema = this.schemaRepository.create(createSchemaDto);
    return await this.schemaRepository.save(schema);
  }

  async findAll(): Promise<Schema[]> {
    return await this.schemaRepository.find();
  }

  async findOne(id: string): Promise<Schema> {
    const schema = await this.schemaRepository.findOne({ where: { id } });
    if (!schema) {
      throw new NotFoundException(`Schema with ID "${id}" not found`);
    }
    return schema;
  }

  async update(id: string, updateSchemaDto: Partial<CreateSchemaDto>): Promise<Schema> {
    const schema = await this.findOne(id);
    Object.assign(schema, updateSchemaDto);
    return await this.schemaRepository.save(schema);
  }

  async remove(id: string): Promise<void> {
    const schema = await this.findOne(id);
    await this.schemaRepository.remove(schema);
  }
} 