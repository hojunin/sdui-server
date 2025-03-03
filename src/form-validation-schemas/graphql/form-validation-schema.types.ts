import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ZodSchemaDefinition, FormWidgetConfig } from '../entities/form-validation-schema.entity';

@ObjectType()
export class FormValidationSchemaType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  revision: number;

  @Field(() => GraphQLJSON)
  zodSchema: ZodSchemaDefinition;

  @Field(() => GraphQLJSON)
  formConfig: Record<string, FormWidgetConfig>;

  @Field(() => GraphQLJSON, { nullable: true })
  transformers?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  preprocess?: Record<string, string>;

  @Field()
  isPublished: boolean;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateFormValidationSchemaInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => GraphQLJSON)
  zodSchema: ZodSchemaDefinition;

  @Field(() => GraphQLJSON)
  formConfig: Record<string, FormWidgetConfig>;

  @Field(() => GraphQLJSON, { nullable: true })
  transformers?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  preprocess?: Record<string, string>;

  @Field({ nullable: true, defaultValue: false })
  isPublished?: boolean;

  @Field({ nullable: true, defaultValue: true })
  isActive?: boolean;
}

@ObjectType()
export class ZodSchemaResponse {
  @Field(() => GraphQLJSON)
  schema: any;
}

@ObjectType()
export class FormConfigResponse {
  @Field(() => GraphQLJSON)
  zodSchema: ZodSchemaDefinition;

  @Field(() => GraphQLJSON)
  formConfig: Record<string, FormWidgetConfig>;
} 