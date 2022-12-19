import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}
