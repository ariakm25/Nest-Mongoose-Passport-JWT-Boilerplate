import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}
