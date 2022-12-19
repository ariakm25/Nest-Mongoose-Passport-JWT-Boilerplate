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

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new this.roleModel(createRoleDto);
    return await role.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find();
  }

  async findOne(id: string): Promise<Role> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['_id not valid']);
    }

    const data = await this.roleModel.findOne({ _id: id });

    if (!data) {
      throw new NotFoundException(['role not found']);
    }

    return data;
  }

  async updateById(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return await this.roleModel.findByIdAndUpdate(id, updateRoleDto);
  }

  async remove(id: string) {
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
