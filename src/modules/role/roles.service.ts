import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument, RolePermission } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const role = new this.roleModel(createRoleDto);
    return await role.save();
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find();
  }

  async findOne(id: string): Promise<RoleDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['id not valid']);
    }

    const data: RoleDocument = await this.roleModel.findOne({ id: id });

    if (!data) {
      throw new NotFoundException(['role not found']);
    }

    return data;
  }

  async updateById(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    return await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<RoleDocument> {
    return await this.roleModel.findByIdAndRemove(id);
  }

  getAllPermissions() {
    const permissions = [];
    let lastModules: string;
    for (const [key, value] of Object.entries(RolePermission)) {
      const module = key.split('_')[0];

      if (module !== lastModules) {
        permissions.push({ module, abilities: [] });
      }

      permissions[permissions.length - 1].abilities.push(value);

      lastModules = module;
    }

    return permissions;
  }
}
