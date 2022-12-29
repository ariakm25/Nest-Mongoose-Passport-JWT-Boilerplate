import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../modules/user/entities/user.entity';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    @InjectModel(Role.name) private readonly role: Model<Role>,
  ) {}

  async seed(): Promise<any> {
    const users = [];

    const roleAdmin = await this.role.findOne({ name: 'admin' });
    const roleUser = await this.role.findOne({ name: 'user' });

    const usersRoleUsersGenerated = DataFactory.createForClass(User)
      .generate(50)
      .map((val) => ({ ...val, role: roleUser }));

    const usersRoleAdmin: User[] = [
      {
        name: 'admin',
        email: 'admin@admin.com',
        password:
          '$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u',
        role: roleAdmin,
        emailVerifiedAt: new Date(),
      },
      {
        name: 'admin2',
        email: 'admin2@admin.com',
        password:
          '$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u',
        role: roleAdmin,
        emailVerifiedAt: new Date(),
      },
      {
        name: 'admin3',
        email: 'admin3@admin.com',
        password:
          '$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u',
        role: roleAdmin,
        emailVerifiedAt: new Date(),
      },
    ];

    const usersRoleUsers: User[] = [
      {
        name: 'user',
        email: 'user@user.com',
        password:
          '$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u',
        role: roleUser,
        emailVerifiedAt: new Date(),
      },
      {
        name: 'user2',
        email: 'user2@user.com',
        password:
          '$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u',
        role: roleUser,
        emailVerifiedAt: new Date(),
      },
      {
        name: 'user3',
        email: 'user3@user.com',
        password:
          '$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u',
        role: roleUser,
        emailVerifiedAt: new Date(),
      },
    ];

    users.push(
      ...usersRoleAdmin,
      ...usersRoleUsers,
      ...usersRoleUsersGenerated,
    );

    return await this.user.insertMany(users);
  }

  async drop(): Promise<any> {
    return await this.user.deleteMany({});
  }
}
