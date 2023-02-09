import { IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/validator/match';

export class UpdatePasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}
