import { IsDefined, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/validator/match';
import { UserDocument } from '../entities/user.entity';

export class UpdatePasswordUserDto {
  @IsDefined()
  id: string;

  @IsNotEmpty()
  @MinLength(8)
  password: UserDocument['password'];

  @IsNotEmpty()
  @Match('password')
  confirmPassword: UserDocument['password'];
}
