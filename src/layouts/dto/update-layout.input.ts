import { CreateLayoutInput } from './create-layout.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateLayoutInput extends PartialType(CreateLayoutInput) {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
