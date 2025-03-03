import { PartialType } from '@nestjs/mapped-types';
import { CreateFormValidationSchemaDto } from './create-form-validation-schema.dto';

export class UpdateFormValidationSchemaDto extends PartialType(CreateFormValidationSchemaDto) {} 