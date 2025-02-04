import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsString, IsNumber } from 'class-validator';

@InputType()
export class WidgetLayoutInput {
  @Field(() => String)
  @IsUUID()
  layoutId: string;

  @Field(() => String)
  @IsString()
  sectionName: string;

  @Field(() => Number)
  @IsNumber()
  order: number;
}
