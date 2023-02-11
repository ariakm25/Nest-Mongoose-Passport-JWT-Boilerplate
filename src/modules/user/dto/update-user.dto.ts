import { IsDefined, IsEmail, IsOptional, Validate } from 'class-validator';
import { Exists } from 'src/common/decorators/validator/exists';
import { Unique } from 'src/common/decorators/validator/unique';
import { Role } from 'src/modules/role/entities/role.entity';
import { User, UserDocument } from '../entities/user.entity';

export class UpdateUserDto {
  @IsDefined()
  id: string;

  @IsOptional()
  name?: UserDocument['name'];

  @IsEmail()
  @IsOptional()
  @Validate(Unique, [User, 'email', ['_id', 'id']])
  email?: UserDocument['email'];

  @IsOptional()
  bio?: UserDocument['bio'];

  @IsOptional()
  avatar?: UserDocument['avatar'];

  @IsOptional()
  @Validate(Exists, [Role, '_id'])
  roleId?: string;
}
