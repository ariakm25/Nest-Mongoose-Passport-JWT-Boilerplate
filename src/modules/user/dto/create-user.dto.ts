import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Validate,
} from 'class-validator';
import { Unique } from 'src/common/decorators/validator/unique';
import { User, UserDocument } from '../entities/user.entity';

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
  roleId?: string;
}
