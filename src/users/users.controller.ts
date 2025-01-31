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
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleType } from './entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.id !== +id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id') id: string) {
    if (req.user.id !== +id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(+id);
  }

  @Post(':userId/roles/:roleType')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  async addRole(
    @Param('userId') userId: string,
    @Param('roleType') roleType: RoleType,
  ) {
    return this.usersService.addRole(+userId, roleType);
  }

  @Delete(':userId/roles/:roleType')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleType') roleType: RoleType,
  ) {
    return this.usersService.removeRole(+userId, roleType);
  }

  @Get(':userId/roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  async getUserRoles(@Param('userId') userId: string) {
    const user = await this.usersService.findOne(+userId);
    return user.roles;
  }

  @Get(':userId/permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.AUTHENTICATION_ADMIN)
  async getUserPermissions(@Param('userId') userId: string) {
    return this.usersService.getUserPermissions(+userId);
  }
}
