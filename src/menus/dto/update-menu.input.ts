import { CreateMenuInput } from './create-menu.input';
import { InputType, PartialType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateMenuInput extends PartialType(CreateMenuInput) {
  @Field(() => Int)
  id: number;
}
