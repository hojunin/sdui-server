import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FormValidationSchemasService } from './form-validation-schemas.service';
import { 
  FormValidationSchemaType, 
  CreateFormValidationSchemaInput,
  ZodSchemaResponse,
  FormConfigResponse
} from './graphql/form-validation-schema.types';

@Resolver(() => FormValidationSchemaType)
export class FormValidationSchemasResolver {
  constructor(private readonly formValidationSchemasService: FormValidationSchemasService) {}

  @Query(() => [FormValidationSchemaType])
  async formValidationSchemas(): Promise<FormValidationSchemaType[]> {
    return this.formValidationSchemasService.findAll();
  }

  @Query(() => FormValidationSchemaType)
  async formValidationSchema(@Args('id', { type: () => ID }) id: string): Promise<FormValidationSchemaType> {
    return this.formValidationSchemasService.findOne(id);
  }

  @Mutation(() => FormValidationSchemaType)
  async createFormValidationSchema(
    @Args('input') input: CreateFormValidationSchemaInput
  ): Promise<FormValidationSchemaType> {
    return this.formValidationSchemasService.create(input);
  }

  @Mutation(() => Boolean)
  async deleteFormValidationSchema(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.formValidationSchemasService.remove(id);
    return true;
  }

  @Query(() => ZodSchemaResponse)
  async zodSchema(@Args('id', { type: () => ID }) id: string): Promise<ZodSchemaResponse> {
    const schema = await this.formValidationSchemasService.getZodSchema(id);
    return { schema };
  }

  @Query(() => FormConfigResponse)
  async formConfig(@Args('id', { type: () => ID }) id: string): Promise<FormConfigResponse> {
    const config = await this.formValidationSchemasService.getFormConfig(id);
    return {
      zodSchema: config.zodSchema,
      formConfig: config.formConfig
    };
  }

  @Mutation(() => FormValidationSchemaType)
  async publishFormValidationSchema(@Args('id', { type: () => ID }) id: string): Promise<FormValidationSchemaType> {
    return this.formValidationSchemasService.publish(id);
  }

  @Mutation(() => FormValidationSchemaType)
  async unpublishFormValidationSchema(@Args('id', { type: () => ID }) id: string): Promise<FormValidationSchemaType> {
    return this.formValidationSchemasService.unpublish(id);
  }

  @Mutation(() => FormValidationSchemaType)
  async activateFormValidationSchema(@Args('id', { type: () => ID }) id: string): Promise<FormValidationSchemaType> {
    return this.formValidationSchemasService.activate(id);
  }
  
  @Mutation(() => FormValidationSchemaType)
  async deactivateFormValidationSchema(@Args('id', { type: () => ID }) id: string): Promise<FormValidationSchemaType> {
    return this.formValidationSchemasService.deactivate(id);
  }
  
  @Query(() => FormValidationSchemaType)
  async formValidationSchemaByName(
    @Args('name') name: string,
    @Args('revision', { nullable: true }) revision?: number
  ): Promise<FormValidationSchemaType> {
    return this.formValidationSchemasService.findByIdentifier(name, revision);
  }
  
  @Query(() => [FormValidationSchemaType])
  async formValidationSchemaVersions(
    @Args('name') name: string
  ): Promise<FormValidationSchemaType[]> {
    return this.formValidationSchemasService.findAllVersions(name);
  }
} 