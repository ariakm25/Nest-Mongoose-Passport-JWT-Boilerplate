import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { ApiHideProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/role/entities/role.entity';

export type UserDocument = User & Document;
@Schema({
  toJSON: {
    transform: (_doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @ApiHideProperty()
  _id: string;

  @Factory((faker) => faker.name.fullName())
  @Prop({
    required: true,
  })
  name: string;

  @Factory((faker) => faker.internet.email())
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Factory('$2a$10$gKLiOrts6gyxa92zITbkBObiGQ8.xYrlD/EZwE6wzdHNgN61BOK8u')
  @Prop({
    required: true,
  })
  password: string;

  @Factory((faker) => faker.image.avatar())
  @Prop()
  avatar?: string;

  @Factory((faker) => faker.lorem.words(10))
  @Prop()
  bio?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
