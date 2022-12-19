import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';

export type ArticleDocument = HydratedDocument<Article>;
@Schema({
  timestamps: true,
})
export class Article {
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
      type: Types.ObjectId,
      ref: Category.name,
    },
  ])
  categories: Category[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  author: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
