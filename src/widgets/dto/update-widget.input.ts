import { CreateWidgetInput } from './create-widget.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateWidgetInput extends PartialType(CreateWidgetInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
