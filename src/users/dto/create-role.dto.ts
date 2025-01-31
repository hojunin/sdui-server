import { IsEnum, IsString, IsArray, IsOptional } from 'class-validator';
import { RoleType } from '../entities/role.entity';

export class CreateRoleDto {
  @IsEnum(RoleType)
  name: RoleType;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @IsOptional()
  @IsString()
  domain?: string;
}
