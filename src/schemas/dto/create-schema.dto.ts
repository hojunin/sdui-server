import { IsString, IsNotEmpty, IsObject, IsOptional, IsArray } from 'class-validator';

export class CreateSchemaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsNotEmpty()
  zodSchema: Record<string, any>;

  @IsObject()
  @IsOptional()
  validationRules?: Record<string, any>;

  @IsArray()
  @IsOptional()
  uiConfig?: {
    inputType: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
    label?: string;
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  }[];
} 