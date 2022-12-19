import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from './decorators/require-permissions.decorators';
import { RoleDocument, RolePermission } from './entities/role.entity';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('permissions')
  @ApiOperation({
    summary: 'Get All Permissions',
    description: 'Get All Permissions',
  })
  permissions() {
    return this.rolesService.getAllPermissions();
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ROLE_CREATE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new Role',
    description:
      'Create new Role with name, permissions and description. Permissions are optional',
  })
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ROLE_READ)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Roles',
    description: 'Get all Role',
  })
  findAll(): Promise<RoleDocument[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ROLE_READ)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Detail Role',
    description: 'Detail Role',
  })
  findOne(@Param('id') id: string): Promise<RoleDocument> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ROLE_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Role',
    description: 'Update Role',
  })
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    return this.rolesService.updateById(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ROLE_DELETE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Role',
    description: 'Delete Role',
  })
  remove(@Param('id') id: string): Promise<RoleDocument> {
    return this.rolesService.remove(id);
  }
}
