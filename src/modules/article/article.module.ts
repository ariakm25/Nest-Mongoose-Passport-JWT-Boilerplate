import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article, ArticleSchema } from './entities/article.entity';
import mongoosePaginate from 'mongoose-paginate-v2';
import MongooseDelete from 'mongoose-delete';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    CategoryModule,
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Article.name,
        useFactory: () => {
          const schema = ArticleSchema;

          schema.plugin(mongoosePaginate);
          schema.plugin(MongooseDelete, {
            deletedBy: true,
            overrideMethods: 'all',
            indexFields: ['deleted', 'deletedAt'],
          });

          return schema;
        },
      },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
