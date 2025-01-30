import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleType } from './entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post(':userId/roles/:roleType')
  @UseGuards(RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  async addRole(
    @Param('userId') userId: string,
    @Param('roleType') roleType: RoleType,
  ) {
    return this.usersService.addRole(+userId, roleType);
  }

  @Delete(':userId/roles/:roleType')
  @UseGuards(RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleType') roleType: RoleType,
  ) {
    return this.usersService.removeRole(+userId, roleType);
  }

  @Get(':userId/roles')
  // @UseGuards(RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  async getUserRoles(@Param('userId') userId: string) {
    const user = await this.usersService.findOne(+userId);
    return user.roles;
  }

  @Get(':userId/permissions')
  @UseGuards(RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  async getUserPermissions(@Param('userId') userId: string) {
    return this.usersService.getUserPermissions(+userId);
  }
}
