import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @IsOptional()
  @IsString()
  domain?: string;
}
