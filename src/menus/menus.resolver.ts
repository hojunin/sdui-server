import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Menu } from './entities/menu.entity';
import { MenusService } from './menus.service';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';

@Resolver(() => Menu)
@UseGuards(JwtAuthGuard)
export class MenusResolver {
  constructor(private readonly menusService: MenusService) {}

  @Query(() => [Menu])
  async menus(): Promise<Menu[]> {
    return this.menusService.findAll();
  }

  @Query(() => Menu)
  async menu(@Args('id', { type: () => Int }) id: number): Promise<Menu> {
    return this.menusService.findOne(id);
  }

  @Mutation(() => Menu)
  async createMenu(
    @Args('input') createMenuInput: CreateMenuInput,
  ): Promise<Menu> {
    return this.menusService.create(createMenuInput);
  }

  @Mutation(() => Menu)
  async updateMenu(
    @Args('input') updateMenuInput: UpdateMenuInput,
  ): Promise<Menu> {
    return this.menusService.update(updateMenuInput);
  }

  @Mutation(() => Boolean)
  async removeMenu(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.menusService.remove(id);
  }
}
