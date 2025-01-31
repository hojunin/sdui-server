import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: TreeRepository<Menu>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.findTrees({
      depth: 3, // 최대 3뎁스까지만 조회
      relations: ['children'],
    });
  }

  async findOne(id: number): Promise<Menu> {
    return this.menuRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
  }

  async create(createMenuInput: CreateMenuInput): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuInput);

    if (createMenuInput.parentId) {
      const parent = await this.findOne(createMenuInput.parentId);
      if (!parent) {
        throw new NotFoundException(
          `Parent menu with ID ${createMenuInput.parentId} not found`,
        );
      }
      menu.parent = parent;
    }

    return this.menuRepository.save(menu);
  }

  async update(updateMenuInput: UpdateMenuInput): Promise<Menu> {
    const menu = await this.findOne(updateMenuInput.id);
    if (!menu) {
      throw new NotFoundException(
        `Menu with ID ${updateMenuInput.id} not found`,
      );
    }

    if (updateMenuInput.parentId !== undefined) {
      if (updateMenuInput.parentId === null) {
        menu.parent = null;
      } else {
        const parent = await this.findOne(updateMenuInput.parentId);
        if (!parent) {
          throw new NotFoundException(
            `Parent menu with ID ${updateMenuInput.parentId} not found`,
          );
        }
        menu.parent = parent;
      }
    }

    Object.assign(menu, updateMenuInput);
    return this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<boolean> {
    const menu = await this.findOne(id);
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    await this.menuRepository.remove(menu);
    return true;
  }
}
