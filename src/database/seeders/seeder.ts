import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSeeder } from 'src/database/seeders/users.seeder';
import { User, UserSchema } from 'src/modules/user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { Role, RoleSchema } from 'src/modules/role/entities/role.entity';
import { RolesSeeder } from './roles.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
}).run([RolesSeeder, UsersSeeder]);
