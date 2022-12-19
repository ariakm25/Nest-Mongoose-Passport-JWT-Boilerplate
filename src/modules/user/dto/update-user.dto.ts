import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { UserDocument } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  name?: UserDocument['name'];

  @IsEmail()
  @IsOptional()
  email?: UserDocument['email'];

  @IsOptional()
  @MinLength(8)
  password?: UserDocument['password'];

  @IsOptional()
  bio?: UserDocument['bio'];

  @IsOptional()
  avatar?: UserDocument['avatar'];
}
