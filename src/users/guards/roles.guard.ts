import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<RoleType[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      return false;
    }

    return requiredRoles.some((role) =>
      user.roles.some(
        (userRole) =>
          userRole.name === role || userRole.name === RoleType.SUPER_ADMIN,
      ),
    );
  }
}
