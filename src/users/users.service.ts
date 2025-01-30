import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role, RoleType } from './entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const defaultRole = await this.rolesRepository.findOneBy({
      name: RoleType.INTERNAL_STAFF,
    });

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles: [defaultRole],
    });

    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: refreshToken,
    });
  }

  async addRole(userId: number, roleType: RoleType): Promise<User> {
    const user = await this.findOne(userId);
    const role = await this.rolesRepository.findOneBy({ name: roleType });

    if (!user.roles) {
      user.roles = [];
    }

    if (!user.roles.some((existingRole) => existingRole.id === role.id)) {
      user.roles.push(role);
      await this.usersRepository.save(user);
    }

    return user;
  }

  async removeRole(userId: number, roleType: RoleType): Promise<User> {
    const user = await this.findOne(userId);
    user.roles = user.roles.filter((role) => role.name !== roleType);
    return this.usersRepository.save(user);
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.findOne(userId);
    return user.getAllPermissions();
  }
}
