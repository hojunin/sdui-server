import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../users/entities/role.entity';
import { initialRoles } from './role.seed';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const existingRoles = await this.rolesRepository.find();

    if (existingRoles.length === 0) {
      const roles = this.rolesRepository.create(initialRoles);
      await this.rolesRepository.save(roles);
      console.log('Roles seeded successfully');
    }
  }
}
