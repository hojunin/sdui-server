import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsNumber } from 'class-validator';

@InputType()
export class WidgetRelationInput {
  @Field(() => String)
  @IsUUID()
  widgetId: string;

  @Field(() => Number)
  @IsNumber()
  order: number;
}
