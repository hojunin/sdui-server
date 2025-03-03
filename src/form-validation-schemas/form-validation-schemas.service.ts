import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { FormValidationSchema, ZodTransformation } from './entities/form-validation-schema.entity';
import { CreateFormValidationSchemaInput } from './graphql/form-validation-schema.types';

@Injectable()
export class FormValidationSchemasService {
  constructor(
    @InjectRepository(FormValidationSchema)
    private readonly formValidationSchemaRepository: Repository<FormValidationSchema>,
  ) {}

  async create(createDto: CreateFormValidationSchemaInput): Promise<FormValidationSchema> {
    // DTO를 엔티티에 맞게 변환
    const entityData: Partial<FormValidationSchema> = {
      ...createDto,
      transformers: this.convertTransformers(createDto.transformers)
    };
    
    // 동일한 name을 가진 스키마가 있는지 확인
    const existingSchemas = await this.formValidationSchemaRepository.find({
      where: { name: createDto.name },
      order: { revision: 'DESC' }
    });
    
    // 기존 스키마가 있으면 revision을 증가시킴
    if (existingSchemas.length > 0) {
      entityData.revision = existingSchemas[0].revision + 1;
      
      // 새 버전이 생성되면 이전 버전은 비활성화
      await this.deactivatePreviousVersions(createDto.name);
    }
    
    const schema = this.formValidationSchemaRepository.create(entityData);
    return await this.formValidationSchemaRepository.save(schema);
  }

  async findAll(): Promise<FormValidationSchema[]> {
    // 서브쿼리를 사용하여 각 name별로 isActive가 true인 스키마만 가져옵니다
    const activeSchemas = await this.formValidationSchemaRepository
      .createQueryBuilder('schema')
      .where('schema.isActive = :isActive', { isActive: true })
      .getMany();
    
    // name별로 중복을 제거합니다 (같은 name을 가진 스키마가 여러 개 있을 경우)
    const uniqueSchemas = new Map<string, FormValidationSchema>();
    
    activeSchemas.forEach(schema => {
      // 이미 해당 name의 스키마가 있는 경우, revision이 더 높은 것을 선택합니다
      if (
        !uniqueSchemas.has(schema.name) || 
        schema.revision > uniqueSchemas.get(schema.name)!.revision
      ) {
        uniqueSchemas.set(schema.name, schema);
      }
    });
    
    return Array.from(uniqueSchemas.values());
  }

  async findOne(id: string): Promise<FormValidationSchema> {
    const schema = await this.formValidationSchemaRepository.findOne({ where: { id } });
    if (!schema) {
      throw new NotFoundException(`Form validation schema with ID "${id}" not found`);
    }
    return schema;
  }

  async remove(id: string): Promise<void> {
    const schema = await this.findOne(id);
    await this.formValidationSchemaRepository.remove(schema);
  }

  async getZodSchema(id: string): Promise<any> {
    const schema = await this.findOne(id);
    return schema.toZodSchema();
  }

  async getFormConfig(id: string): Promise<Record<string, any>> {
    const schema = await this.findOne(id);
    return {
      zodSchema: schema.zodSchema,
      formConfig: schema.formConfig,
    };
  }

  async publish(id: string): Promise<FormValidationSchema> {
    const schema = await this.findOne(id);
    schema.isPublished = true;
    return await this.formValidationSchemaRepository.save(schema);
  }

  async unpublish(id: string): Promise<FormValidationSchema> {
    const schema = await this.findOne(id);
    schema.isPublished = false;
    return await this.formValidationSchemaRepository.save(schema);
  }

  async activate(id: string): Promise<FormValidationSchema> {
    const schema = await this.findOne(id);
    
    // 동일한 name을 가진 다른 버전들을 비활성화
    await this.deactivatePreviousVersions(schema.name, id);
    
    // 현재 스키마 활성화
    schema.isActive = true;
    return await this.formValidationSchemaRepository.save(schema);
  }
  
  async deactivate(id: string): Promise<FormValidationSchema> {
    const schema = await this.findOne(id);
    schema.isActive = false;
    return await this.formValidationSchemaRepository.save(schema);
  }
  
  async findByIdentifier(name: string, revision?: number): Promise<FormValidationSchema> {
    let query: FindOneOptions<FormValidationSchema> = {
      where: { name }
    };

    // 특정 리비전이 지정된 경우
    if (revision) {
      query.where = { name, revision };
    } else {
      // 리비전이 지정되지 않은 경우 최신 활성 버전 반환
      query.where = { name, isActive: true };
      query.order = { revision: 'DESC' };
    }

    const schema = await this.formValidationSchemaRepository.findOne(query);
    
    if (!schema) {
      if (revision) {
        throw new NotFoundException(`Form validation schema with name "${name}" and revision ${revision} not found`);
      } else {
        throw new NotFoundException(`Active form validation schema with name "${name}" not found`);
      }
    }
    
    return schema;
  }
  
  async findAllVersions(name: string): Promise<FormValidationSchema[]> {
    return await this.formValidationSchemaRepository.find({
      where: { name },
      order: { revision: 'DESC' }
    });
  }
  
  private async deactivatePreviousVersions(name: string, exceptId?: string): Promise<void> {
    const query = this.formValidationSchemaRepository.createQueryBuilder('schema')
      .update()
      .set({ isActive: false })
      .where('name = :name', { name });
    
    if (exceptId) {
      query.andWhere('id != :id', { id: exceptId });
    }
    
    await query.execute();
  }
  
  // Record<string, any>를 Record<string, ZodTransformation>으로 변환
  private convertTransformers(transformers?: Record<string, any>): Record<string, ZodTransformation> | undefined {
    if (!transformers) return undefined;
    
    const result: Record<string, ZodTransformation> = {};
    
    for (const [key, value] of Object.entries(transformers)) {
      if (typeof value === 'string') {
        // 문자열인 경우 ZodTransformation 객체로 변환
        result[key] = { function: value };
      } else if (typeof value === 'object') {
        // 이미 객체인 경우 그대로 사용
        result[key] = value as ZodTransformation;
      }
    }
    
    return result;
  }
} 