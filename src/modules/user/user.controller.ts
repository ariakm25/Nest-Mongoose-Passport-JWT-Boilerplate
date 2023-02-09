import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../role/decorators/require-permissions.decorators';
import { RolePermission } from '../role/entities/role.entity';
import { QueryUserDto } from './dto/query-user.dto';
import { UserDocument } from './entities/user.entity';
import { PaginateResult } from 'mongoose';
import { User } from 'src/common/decorators/user.decorator';
import { AuthState } from '../auth/entity/auth.entity';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.USER_CREATE)
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.USER_READ)
  @ApiBearerAuth()
  findAll(
    @Query() queryUserDto: QueryUserDto,
  ): Promise<PaginateResult<UserDocument>> {
    return this.usersService.findAll(queryUserDto);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.USER_READ)
  @ApiBearerAuth()
  findOne(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.USER_UPDATE)
  @ApiBearerAuth()
  update(@Body() updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.usersService.updateById(updateUserDto.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.USER_DELETE)
  @ApiBearerAuth()
  remove(
    @Param('id') id: string,
    @User() user: AuthState,
  ): Promise<UserDocument> {
    if (user.id === id) {
      throw new ForbiddenException(['You cannot delete yourself']);
    }
    return this.usersService.remove(id);
  }
}
