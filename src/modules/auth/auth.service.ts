import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import bcrypt from 'bcryptjs';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenType } from 'src/modules/token/token.enum';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { TokenDocument } from '../token/entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user: UserDocument = await this.usersService.findOneBy(
      'email',
      email,
    );

    if (user) {
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          role: user.role,
          access_token: this.tokenService.createAccessToken(user),
          refresh_token: await this.tokenService.createRefreshToken(user),
        };
      }
    }
    throw new BadRequestException(['email or password is incorrect']);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<any> {
    const { refresh_token } = refreshTokenDto;

    const verify = await this.tokenService.validateRefreshToken(refresh_token);

    if (typeof verify === 'string') {
      const user: UserDocument = await this.usersService.findOne(verify);

      if (!user) {
        throw new BadRequestException(['invalid user refresh token']);
      }

      await this.tokenService.deleteToken(
        refresh_token,
        TokenType.RefreshToken,
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        access_token: this.tokenService.createAccessToken(user),
        refresh_token: await this.tokenService.createRefreshToken(user),
      };
    }

    throw new BadRequestException(['invalid refresh token']);
  }

  async sendResetPasswordEmail(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    const user: UserDocument = await this.usersService.findOneBy(
      'email',
      resetPasswordDto.email,
    );
    if (!user) {
      return false;
    }

    const checkToken = await this.tokenService.isTokenRecentlyAdded(
      user.id,
      TokenType.ResetPassword,
    );

    if (checkToken) {
      throw new BadRequestException([
        'token already sent, please wait for 5 minutes to send new token',
      ]);
    }

    const token = await this.tokenService.createRandomTokenForUser(
      user,
      TokenType.ResetPassword,
    );

    try {
      await this.mailService.sendResetPasswordEmail(user.email, token);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return true;
  }

  async updatePassword(updatePassword: UpdatePasswordDto): Promise<boolean> {
    const { password, token } = updatePassword;
    const checkToken: TokenDocument = await this.tokenService.getToken(
      token,
      TokenType.ResetPassword,
      true,
    );

    if (!checkToken) {
      throw new BadRequestException(['invalid token']);
    }

    await this.usersService.updatePassword(checkToken.user.id, password);

    await this.tokenService.deleteAllUserTokens(checkToken.user.id);

    return true;
  }

  async logout(id: string): Promise<boolean> {
    await this.tokenService.deleteAllUserTokens(id, TokenType.RefreshToken);
    return true;
  }

  async me(id: string): Promise<UserDocument> {
    return await this.usersService.findOne(id);
  }
}
