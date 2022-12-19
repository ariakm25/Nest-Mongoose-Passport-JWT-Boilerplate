import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Role, RolePermission } from 'src/modules/role/entities/role.entity';

@Injectable()
export class RolesSeeder implements Seeder {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async seed(): Promise<any> {
    const allPermissions = Object.values(RolePermission);
    console.log(allPermissions);

    const roles = [
      {
        name: 'admin',
        permissions: allPermissions,
      },
      {
        name: 'user',
        permissions: [],
      },
    ];

    return await this.roleModel.insertMany(roles);
  }

  async drop(): Promise<any> {
    return await this.roleModel.deleteMany({});
  }
}
