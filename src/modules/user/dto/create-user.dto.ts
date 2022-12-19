import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { UserDocument } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: UserDocument['name'];

  @IsEmail()
  email: UserDocument['email'];

  @IsNotEmpty()
  @MinLength(8)
  password: UserDocument['password'];

  @IsOptional()
  bio?: UserDocument['bio'];

  @IsOptional()
  avatar?: UserDocument['avatar'];
}
