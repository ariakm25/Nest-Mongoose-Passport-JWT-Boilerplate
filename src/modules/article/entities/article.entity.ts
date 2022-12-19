import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';

export type ArticleDocument = Article & Document;
@Schema({
  timestamps: true,
})
export class Article {
  @ApiHideProperty()
  _id: string;

  @Prop()
  title: string;

  @Prop({
    slug: 'title',
    unique: true,
    index: true,
  })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  thumbnail: string;

  @Prop()
  content: string;

  @Prop({
    type: String,
    default: 'DRAFT',
    enum: ['DRAFT', 'PUBLISHED', 'PINNED'],
  })
  status: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category.name,
    },
  ])
  categories: Category[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  author: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
