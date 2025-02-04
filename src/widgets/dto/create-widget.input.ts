import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { WidgetType } from '../entities/widget.entity';
import { WidgetLayoutInput } from './widget-layout.input';
import { WidgetRelationInput } from './widget-relation.input';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateWidgetInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  @IsEnum(WidgetType)
  type: WidgetType;

  @Field(() => [WidgetLayoutInput], { nullable: true })
  @IsOptional()
  layouts?: WidgetLayoutInput[];

  @Field(() => [WidgetRelationInput], { nullable: true })
  @IsOptional()
  children?: WidgetRelationInput[];

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  props?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  rules?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  style?: Record<string, any>;
}
