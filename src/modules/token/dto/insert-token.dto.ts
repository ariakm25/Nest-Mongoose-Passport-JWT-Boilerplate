import { IsNotEmpty, IsOptional } from 'class-validator';
import { TokenType } from 'src/modules/token/token.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { TokenDocument } from '../entities/token.entity';

export class InsertTokenDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  token: TokenDocument['token'];

  @IsNotEmpty()
  type: TokenType;

  @IsOptional()
  expires?: Date;
}
