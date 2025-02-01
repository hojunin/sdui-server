import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LayoutsService } from './layouts.service';
import { Layout } from './entities/layout.entity';
import { CreateLayoutInput } from './dto/create-layout.input';
import { UpdateLayoutInput } from './dto/update-layout.input';

@Resolver(() => Layout)
export class LayoutsResolver {
  constructor(private readonly layoutsService: LayoutsService) {}

  @Mutation(() => Layout)
  createLayout(
    @Args('createLayoutInput') createLayoutInput: CreateLayoutInput,
  ) {
    return this.layoutsService.create(createLayoutInput);
  }

  @Query(() => [Layout], { name: 'layouts' })
  findAll() {
    return this.layoutsService.findAll();
  }

  @Query(() => Layout, { name: 'layout' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.layoutsService.findOne(id);
  }

  @Query(() => Layout, { name: 'layoutByPath' })
  findByPath(@Args('path', { type: () => String }) path: string) {
    return this.layoutsService.findByPath(path);
  }

  @Query(() => [Layout], { name: 'layoutHistory' })
  getLayoutHistory(@Args('path', { type: () => String }) path: string) {
    return this.layoutsService.getLayoutHistory(path);
  }

  //FIXME 없애는 것 고려. 특정 리비전을 수정하는 것은 형상관리 측면에서 맞지 않음.
  @Mutation(() => Layout)
  updateLayout(
    @Args('updateLayoutInput') updateLayoutInput: UpdateLayoutInput,
  ) {
    return this.layoutsService.update(updateLayoutInput.id, updateLayoutInput);
  }

  //FIXME 없애는 것 고려. 특정 리비전을 삭제하는 것은 형상관리 측면에서 맞지 않음.
  @Mutation(() => Boolean)
  removeLayout(@Args('id', { type: () => ID }) id: string) {
    return this.layoutsService.remove(id);
  }
}
