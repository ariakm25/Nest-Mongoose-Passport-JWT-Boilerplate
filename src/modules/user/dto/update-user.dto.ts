import {
  IsDefined,
  IsEmail,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { Unique } from 'src/common/decorators/validator/unique';
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
  @MinLength(8)
  password?: UserDocument['password'];

  @IsOptional()
  bio?: UserDocument['bio'];

  @IsOptional()
  avatar?: UserDocument['avatar'];
}
