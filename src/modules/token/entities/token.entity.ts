import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/entities/user.entity';
import { TokenType } from 'src/modules/token/token.enum';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: true,
})
export class Token {
  @Prop({
    required: true,
  })
  token: string;

  @Prop({
    required: true,
    enum: [
      TokenType.ResetPassword,
      TokenType.ConfirmEmail,
      TokenType.RefreshToken,
    ],
  })
  type: string;

  @Prop({
    required: false,
    nullable: true,
  })
  expires: Date;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
