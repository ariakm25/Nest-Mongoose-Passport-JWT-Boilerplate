import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSION_KEY } from 'src/modules/role/decorators/require-permissions.decorators';
import { RolePermission } from 'src/modules/role/entities/role.entity';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const requiredPermissions = this.reflector.getAllAndOverride<
      RolePermission[]
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredPermissions.some((permission) =>
      user.role.permissions?.includes(permission),
    );
  }
}
