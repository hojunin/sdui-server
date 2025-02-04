import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { WidgetsService } from './widgets.service';
import { Widget } from './entities/widget.entity';
import { CreateWidgetInput } from './dto/create-widget.input';
import { UpdateWidgetInput } from './dto/update-widget.input';

@Resolver(() => Widget)
export class WidgetsResolver {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Mutation(() => Widget)
  createWidget(
    @Args('createWidgetInput') createWidgetInput: CreateWidgetInput,
  ) {
    return this.widgetsService.create(createWidgetInput);
  }

  @Query(() => [Widget], { name: 'widgets' })
  findAll() {
    return this.widgetsService.findAll();
  }

  @Query(() => Widget, { name: 'widget' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.widgetsService.findOne(id);
  }

  @Mutation(() => Widget)
  updateWidget(
    @Args('updateWidgetInput') updateWidgetInput: UpdateWidgetInput,
  ) {
    return this.widgetsService.update(updateWidgetInput.id, updateWidgetInput);
  }

  @Mutation(() => Boolean)
  removeWidget(@Args('id', { type: () => ID }) id: string) {
    return this.widgetsService.remove(id);
  }

  @Query(() => [Widget], { name: 'widgetHistory' })
  findHistory(@Args('id', { type: () => ID }) id: string) {
    return this.widgetsService.findHistory(id);
  }

  @Query(() => [Widget], { name: 'widgetsByLayout' })
  findByLayout(@Args('layoutId', { type: () => ID }) layoutId: string) {
    return this.widgetsService.findByLayoutId(layoutId);
  }

  @Query(() => [Widget], { name: 'widgetsByParent' })
  findByParent(@Args('parentId', { type: () => ID }) parentId: string) {
    return this.widgetsService.findByParentId(parentId);
  }
}
