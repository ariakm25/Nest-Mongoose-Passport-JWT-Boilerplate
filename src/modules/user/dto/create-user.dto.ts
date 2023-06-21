import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Validate,
} from 'class-validator';
import { Unique } from 'src/common/decorators/validator/unique';
import { User, UserDocument } from '../entities/user.entity';
import { Exists } from "../../../common/decorators/validator/exists";
import { Role } from "../../role/entities/role.entity";

export class CreateUserDto {
  @IsNotEmpty()
  name: UserDocument['name'];

  @IsEmail()
  @Validate(Unique, [User, 'email'])
  email: UserDocument['email'];

  @IsNotEmpty()
  @MinLength(8)
  password: UserDocument['password'];

  @IsOptional()
  bio?: UserDocument['bio'];

  @IsOptional()
  avatar?: UserDocument['avatar'];

  @IsNotEmpty()
  @Validate(Exists, [Role, '_id'])
  roleId?: string;
}
