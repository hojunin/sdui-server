import { Field, InputType, ID } from '@nestjs/graphql';
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

@InputType()
export class LayoutStyleInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  padding?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  margin?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  width?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  height?: string;
}

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

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  children: string[];

  @Field(() => LayoutStyleInput, { nullable: true })
  @IsOptional()
  style?: LayoutStyleInput;
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

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  baseTemplateId?: string;
}
