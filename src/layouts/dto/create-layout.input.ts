import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LayoutSectionType } from '../entities/layout.entity';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class LayoutSectionInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => LayoutSectionType)
  @IsEnum(LayoutSectionType)
  type: LayoutSectionType;

  @Field(() => Number)
  @IsNumber()
  order: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  widgetTypes?: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  style?: Record<string, any>;
}

@InputType()
export class CreateLayoutInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  path: string;

  @Field(() => [LayoutSectionInput])
  @IsArray()
  sections: LayoutSectionInput[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  templateName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  templateDescription?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  baseTemplateId?: string;
}
