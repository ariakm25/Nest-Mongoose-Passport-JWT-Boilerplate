import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiHideProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;
@Schema({
  toJSON: {
    transform: (_doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class Category {
  @ApiHideProperty()
  _id: string;

  @Prop()
  name: string;

  @Prop({
    slug: 'name',
    unique: true,
    index: true,
  })
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
