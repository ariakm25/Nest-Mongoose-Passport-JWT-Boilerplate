import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { TokenType } from 'src/modules/token/token.enum';

export type TokenDocument = Token & Document;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
