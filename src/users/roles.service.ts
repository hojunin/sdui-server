import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findByName(name: RoleType): Promise<Role> {
    return this.rolesRepository.findOneBy({ name });
  }

  async findById(id: number): Promise<Role> {
    return this.rolesRepository.findOneBy({ id });
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async create(name: RoleType, permissions: string[]): Promise<Role> {
    const role = this.rolesRepository.create({
      name,
      permissions,
    });
    return this.rolesRepository.save(role);
  }

  async update(id: number, permissions: string[]): Promise<Role> {
    await this.rolesRepository.update(id, { permissions });
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.rolesRepository.remove(role);
  }
}
