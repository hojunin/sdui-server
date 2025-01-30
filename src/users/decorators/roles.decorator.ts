import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../entities/role.entity';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
