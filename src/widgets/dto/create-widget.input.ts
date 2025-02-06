import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { WidgetType } from '../entities/widget.entity';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateWidgetInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  @IsEnum(WidgetType)
  type: WidgetType;

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
