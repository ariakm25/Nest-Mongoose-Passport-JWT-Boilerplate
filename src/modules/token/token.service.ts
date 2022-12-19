import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserDocument } from '../user/entities/user.entity';
import { Token, TokenDocument } from './entities/token.entity';
import { InsertTokenDto } from './dto/insert-token.dto';
import { TokenType } from 'src/modules/token/token.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  createAccessToken(user: UserDocument): string {
    const payload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(user: UserDocument): Promise<string> {
    const payload = {
      sub: user.id,
    };

    const generateRefreshToken = this.jwtService.sign(
      payload,
      this.getRefreshTokenOptions(),
    );

    const refreshToken: TokenDocument = await this.insertToken({
      type: TokenType.RefreshToken,
      user: user,
      token: generateRefreshToken,
    });

    return refreshToken.token;
  }

  async validateRefreshToken(token: string): Promise<string | boolean> {
    const getToken: TokenDocument = await this.tokenModel.findOne({
      token,
      type: TokenType.RefreshToken,
    });

    if (!getToken) {
      return false;
    }

    const verify = this.jwtService.verify(token, this.getRefreshTokenOptions());

    if (!verify) {
      return false;
    }

    return verify.sub;
  }

  private getRefreshTokenOptions(): JwtSignOptions {
    return {
      secret: this.configService.get<string>('token.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('token.refreshTokenExpiration'),
    };
  }

  async createRandomTokenForUser(
    user: UserDocument,
    type: TokenType,
  ): Promise<string> {
    const token = randomBytes(30).toString('hex');

    await this.insertToken({
      type,
      user,
      token,
    });

    return token;
  }

  private async insertToken(
    insertTokenDto: InsertTokenDto,
  ): Promise<TokenDocument> {
    let expires: Date = new Date();
    switch (insertTokenDto.type) {
      case TokenType.ResetPassword:
        expires.setHours(
          this.configService.get<number>('token.resetPasswordTokenExpiration'),
        );
        break;
      case TokenType.ConfirmEmail:
        expires.setHours(
          this.configService.get<number>('token.confirmEmailTokenExpiration'),
        );
        break;
      default:
        expires = null;
        break;
    }

    const payload = { ...insertTokenDto, expires };
    return await this.tokenModel.create(payload);
  }

  async getToken(
    token: string,
    type: TokenType,
    checkExpires?: boolean,
  ): Promise<TokenDocument> {
    const getToken: TokenDocument = await this.tokenModel
      .findOne({
        token,
        type,
      })
      .populate('user');

    if (!getToken) {
      throw new BadRequestException(['invalid token']);
    }

    if (checkExpires && getToken.expires && getToken.expires < new Date()) {
      await this.tokenModel.deleteOne({ _id: getToken._id });
      throw new BadRequestException(['token expired']);
    }

    return getToken;
  }

  async isTokenRecentlyAdded(
    userId: string,
    type: TokenType,
  ): Promise<boolean> {
    const check: TokenDocument = await this.tokenModel.findOne({
      user: userId,
      type,
      createdAt: { $gte: new Date(new Date().getTime() - 1000 * 60 * 5) },
    });

    return !!check;
  }

  async deleteToken(token: string, type: TokenType): Promise<any> {
    return await this.tokenModel.deleteOne({ token, type });
  }

  async deleteAllUserTokens(userId: string, type?: TokenType): Promise<any> {
    let query: any = { user: userId };
    if (type) {
      query = { ...query, type };
    }
    return await this.tokenModel.deleteMany(query);
  }
}
