import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormValidationSchemasService } from './form-validation-schemas.service';
import { FormValidationSchema } from './entities/form-validation-schema.entity';
import { FormValidationSchemasResolver } from './form-validation-schemas.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([FormValidationSchema])],
  providers: [FormValidationSchemasService, FormValidationSchemasResolver],
  exports: [FormValidationSchemasService],
})
export class FormValidationSchemasModule {} 