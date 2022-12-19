import { SetMetadata } from '@nestjs/common';
import { RolePermission } from '../entities/role.entity';

export const PERMISSION_KEY = 'permissions';
export const RequirePermissions = (...permissions: RolePermission[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
