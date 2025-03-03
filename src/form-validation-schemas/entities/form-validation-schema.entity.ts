import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { z } from 'zod';

export type ZodPrimitiveType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'bigint'
  | 'symbol'
  | 'undefined'
  | 'null';

export interface ZodStringValidation {
  min?: { value: number; message?: string };
  max?: { value: number; message?: string };
  length?: { value: number; message?: string };
  email?: { message?: string };
  url?: { message?: string };
  uuid?: { message?: string };
  regex?: { pattern: string; message?: string };
  includes?: { value: string; position?: number; message?: string };
  startsWith?: { value: string; message?: string };
  endsWith?: { value: string; message?: string };
}

export interface ZodNumberValidation {
  min?: { value: number; message?: string };
  max?: { value: number; message?: string };
  int?: { message?: string };
  positive?: { message?: string };
  negative?: { message?: string };
  multipleOf?: { value: number; message?: string };
}

export interface ZodDateValidation {
  min?: { value: string; message?: string };
  max?: { value: string; message?: string };
}

export interface ZodArrayValidation {
  min?: { value: number; message?: string };
  max?: { value: number; message?: string };
  length?: { value: number; message?: string };
  nonempty?: { message?: string };
}

export type ZodTypeValidation = 
  | { type: 'string'; validation?: ZodStringValidation }
  | { type: 'number'; validation?: ZodNumberValidation }
  | { type: 'date'; validation?: ZodDateValidation }
  | { type: 'array'; validation?: ZodArrayValidation; elementType: ZodSchemaDefinition }
  | { type: 'object'; shape: Record<string, ZodSchemaDefinition> }
  | { type: 'enum'; values: string[] | number[] }
  | { type: 'union'; options: ZodSchemaDefinition[] }
  | { type: 'intersection'; types: ZodSchemaDefinition[] }
  | { type: 'promise'; valueType: ZodSchemaDefinition }
  | { type: 'function'; args: ZodSchemaDefinition[]; returnType: ZodSchemaDefinition }
  | { type: 'literal'; value: any }
  | { type: 'record'; keyType: ZodSchemaDefinition; valueType: ZodSchemaDefinition }
  | { type: 'map'; keyType: ZodSchemaDefinition; valueType: ZodSchemaDefinition }
  | { type: 'set'; valueType: ZodSchemaDefinition }
  | { type: 'instanceof'; className: string }
  | { type: 'lazy'; getter: string };

export interface ZodRefinement {
  type: 'refine' | 'superRefine';
  function: string; // 실제 함수 이름
  message?: string;
  path?: string[];
}

export interface ZodTransformation {
  function: string; // 변환 함수 이름
  dependencies?: string[]; // 다른 필드에 대한 의존성
}

export interface ZodSchemaDefinition {
  type: ZodTypeValidation;
  optional?: boolean;
  nullable?: boolean;
  default?: any;
  catch?: any;
  description?: string;
  refinements?: ZodRefinement[];
  transformations?: ZodTransformation[];
  brand?: string;
  pipe?: ZodSchemaDefinition;
}

export interface FormWidgetConfig {
  widgetType: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'file';
  label?: string;
  placeholder?: string;
  helperText?: string;
  options?: Array<{ label: string; value: string | number }>;
  validation?: {
    errorMessage?: string;
    asyncValidation?: string; // 비동기 검증 함수 이름
  };
  dependencies?: string[]; // 다른 필드에 대한 의존성
  conditionalDisplay?: {
    field: string;
    condition: string;
    value: any;
  };
}

@Entity('form_validation_schemas')
export class FormValidationSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 1 })
  revision: number;

  @Column({ type: 'jsonb' })
  zodSchema: ZodSchemaDefinition;

  @Column({ type: 'jsonb' })
  formConfig: Record<string, FormWidgetConfig>;

  @Column({ type: 'jsonb', nullable: true })
  transformers?: Record<string, ZodTransformation>;

  @Column({ type: 'jsonb', nullable: true })
  preprocess?: Record<string, string>;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toZodSchema(): z.ZodType<any> {
    return this.convertToZodSchema(this.zodSchema);
  }

  private convertToZodSchema(definition: ZodSchemaDefinition): z.ZodType<any> {
    let schema = this.createBaseSchema(definition);
    
    // Apply refinements
    if (definition.refinements) {
      schema = this.applyRefinements(schema, definition.refinements);
    }

    // Apply transformations
    if (definition.transformations) {
      schema = this.applyTransformations(schema, definition.transformations);
    }

    // Apply modifiers
    if (definition.nullable) schema = schema.nullable();
    if (definition.optional) schema = schema.optional();
    if (definition.default !== undefined) schema = schema.default(definition.default);
    if (definition.catch !== undefined) schema = schema.catch(definition.catch);
    if (definition.brand) schema = schema.brand(definition.brand);
    if (definition.pipe) schema = schema.pipe(this.convertToZodSchema(definition.pipe));

    return schema;
  }

  private createBaseSchema(definition: ZodSchemaDefinition): z.ZodType<any> {
    const { type } = definition;

    if (typeof type === 'string') {
      return this.createPrimitiveSchema(type, definition);
    }

    switch (type.type) {
      case 'array': {
        const arraySchema = z.array(this.convertToZodSchema(type.elementType));
        if (type.validation) {
          const v = type.validation;
          if (v.min) arraySchema.min(v.min.value, v.min.message);
          if (v.max) arraySchema.max(v.max.value, v.max.message);
          if (v.length) arraySchema.length(v.length.value, v.length.message);
          if (v.nonempty) arraySchema.nonempty(v.nonempty.message);
        }
        return arraySchema;
      }

      case 'object': {
        const shape = Object.entries(type.shape).reduce<Record<string, z.ZodTypeAny>>((acc, [key, value]) => {
          acc[key] = this.convertToZodSchema(value);
          return acc;
        }, {});
        return z.object(shape);
      }

      case 'enum': {
        if (type.values.length === 0) {
          throw new Error('Enum values array must not be empty');
        }
        const [first, ...rest] = type.values as [string, ...string[]];
        return z.enum([first, ...rest]);
      }

      case 'union': {
        if (type.options.length < 2) {
          throw new Error('Union must have at least two options');
        }
        const first = this.convertToZodSchema(type.options[0]);
        const second = this.convertToZodSchema(type.options[1]);
        const rest = type.options.slice(2).map(opt => this.convertToZodSchema(opt));
        
        return z.union([first, second, ...rest]);
      }

      case 'intersection': {
        if (type.types.length < 2) {
          throw new Error('Intersection must have at least two types');
        }
        
        return type.types.reduce((acc, curr, index) => {
          if (index === 0) {
            return this.convertToZodSchema(curr);
          }
          return acc.and(this.convertToZodSchema(curr));
        }, z.any());
      }

      case 'promise': {
        return z.promise(this.convertToZodSchema(type.valueType));
      }

      case 'function': {
        const fnSchema = z.function();
        
        if (type.args && type.args.length > 0) {
          const args = type.args.map(arg => this.convertToZodSchema(arg));
          fnSchema.args(...args as [z.ZodTypeAny, ...z.ZodTypeAny[]]);
        }
        
        return fnSchema.returns(this.convertToZodSchema(type.returnType));
      }

      case 'literal': {
        return z.literal(type.value);
      }

      case 'record': {
        return z.record(
          this.convertToZodSchema(type.keyType),
          this.convertToZodSchema(type.valueType)
        );
      }

      case 'map': {
        return z.map(
          this.convertToZodSchema(type.keyType),
          this.convertToZodSchema(type.valueType)
        );
      }

      case 'set': {
        return z.set(this.convertToZodSchema(type.valueType));
      }

      case 'instanceof': {
        const globalObj = typeof window !== 'undefined' ? window : global;
        const ClassRef = (globalObj as any)[type.className];
        if (!ClassRef) {
          throw new Error(`Class "${type.className}" not found in global scope`);
        }
        return z.instanceof(ClassRef);
      }

      case 'lazy': {
        const getterFn = new Function(`return ${type.getter}`)();
        return z.lazy(() => getterFn());
      }

      default:
        return z.any();
    }
  }

  private createPrimitiveSchema(type: string, definition: ZodSchemaDefinition): z.ZodType<any> {
    const validation = (definition.type as any).validation || {};
    
    switch (type) {
      case 'string': {
        let schema = z.string();
        const v = validation as ZodStringValidation;
        if (v.min) schema = schema.min(v.min.value, v.min.message);
        if (v.max) schema = schema.max(v.max.value, v.max.message);
        if (v.length) schema = schema.length(v.length.value, v.length.message);
        if (v.email) schema = schema.email(v.email.message);
        if (v.url) schema = schema.url(v.url.message);
        if (v.uuid) schema = schema.uuid(v.uuid.message);
        if (v.regex) schema = schema.regex(new RegExp(v.regex.pattern), v.regex.message);
        if (v.includes) {
          schema = schema.includes(v.includes.value, {
            message: v.includes.message,
            position: v.includes.position
          });
        }
        if (v.startsWith) schema = schema.startsWith(v.startsWith.value, v.startsWith.message);
        if (v.endsWith) schema = schema.endsWith(v.endsWith.value, v.endsWith.message);
        return schema;
      }

      case 'number': {
        let schema = z.number();
        const v = validation as ZodNumberValidation;
        if (v.min) schema = schema.min(v.min.value, v.min.message);
        if (v.max) schema = schema.max(v.max.value, v.max.message);
        if (v.int) schema = schema.int(v.int.message);
        if (v.positive) schema = schema.positive(v.positive.message);
        if (v.negative) schema = schema.negative(v.negative.message);
        if (v.multipleOf) schema = schema.multipleOf(v.multipleOf.value, v.multipleOf.message);
        return schema;
      }

      case 'date': {
        let schema = z.date();
        const v = validation as ZodDateValidation;
        if (v.min) schema = schema.min(new Date(v.min.value), v.min.message);
        if (v.max) schema = schema.max(new Date(v.max.value), v.max.message);
        return schema;
      }

      case 'boolean': {
        return z.boolean();
      }

      case 'bigint': {
        return z.bigint();
      }

      case 'symbol': {
        return z.symbol();
      }

      case 'undefined': {
        return z.undefined();
      }

      case 'null': {
        return z.null();
      }

      default:
        return z.any();
    }
  }

  private applyRefinements(schema: z.ZodType<any>, refinements: ZodRefinement[]): z.ZodType<any> {
    return refinements.reduce((acc, refinement) => {
      const refineFn = new Function(`return ${refinement.function}`)();
      return acc.refine(refineFn, {
        message: refinement.message,
        path: refinement.path
      });
    }, schema);
  }

  private applyTransformations(schema: z.ZodType<any>, transformations: ZodTransformation[]): z.ZodType<any> {
    return transformations.reduce((acc, transformation) => {
      const transformFn = new Function(`return ${transformation.function}`)();
      return acc.transform(transformFn);
    }, schema);
  }
} 