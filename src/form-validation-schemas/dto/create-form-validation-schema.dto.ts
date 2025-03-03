import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsBoolean,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ZodSchemaDefinition, FormWidgetConfig } from '../entities/form-validation-schema.entity';

export class CreateFormValidationSchemaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object)
  zodSchema: ZodSchemaDefinition;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object)
  formConfig: Record<string, FormWidgetConfig>;

  @IsObject()
  @IsOptional()
  transformers?: Record<string, string>;

  @IsObject()
  @IsOptional()
  preprocess?: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
} 