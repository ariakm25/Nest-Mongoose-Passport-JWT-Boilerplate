import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PaginateModel,
  PaginateResult,
  isValidObjectId,
  PaginateOptions,
} from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { CategoryService } from '../category/category.service';
import { RolePermission } from '../role/entities/role.entity';
import { UserDocument } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: SoftDeleteModel<ArticleDocument> &
      PaginateModel<ArticleDocument>,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    authUser: string,
  ): Promise<ArticleDocument> {
    const validCategories: string[] =
      await this.categoryService.getExistsIdOnly(createArticleDto.categories);
    const dto = {
      ...createArticleDto,
      categories: validCategories,
      author: authUser,
    };
    const article = new this.articleModel(dto);
    return await article.save();
  }

  async findAll(
    queryArticleDto: QueryArticleDto,
    authUser: string,
  ): Promise<PaginateResult<ArticleDocument>> {
    const query: any = {};

    const user: UserDocument = await this.userService.findOne(authUser);
    if (!user.role.permissions.includes(RolePermission.ARTICLE_READ_OTHER)) {
      query.author = user.id;
    }

    if (queryArticleDto.title) {
      query.title = {
        $regex: '.*' + queryArticleDto.title + '.*',
        $options: 'i',
      };
    }

    if (queryArticleDto.status) {
      query.status = {
        $regex: '.*' + queryArticleDto.status + '.*',
        $options: 'i',
      };
    }

    if (queryArticleDto.categories) {
      query.categories = {
        $in: queryArticleDto.categories,
      };
    }

    const options: PaginateOptions = {
      select: [
        'title',
        'id',
        'slug',
        'status',
        'author',
        'categories',
        'createdAt',
        'updatedAt',
      ],
      page: queryArticleDto.page || 1,
      limit: queryArticleDto.limit <= 120 ? queryArticleDto.limit : 24,
      populate: [
        {
          path: 'categories',
        },
        {
          path: 'author',
          select: ['name', 'id', 'avatar'],
        },
      ],
      sort: {
        [queryArticleDto.sortBy ?? 'createdAt']: queryArticleDto.sort ?? -1,
      },
    };

    return await this.articleModel.paginate(query, options);
  }

  async findOne(id: string, authUser: string): Promise<ArticleDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['invalid id']);
    }

    const data: ArticleDocument = await this.articleModel
      .findById(id)
      .populate([
        {
          path: 'categories',
        },
        {
          path: 'author',
          select: ['name', 'id', 'avatar'],
        },
      ]);

    if (!data) {
      throw new NotFoundException(['article not found']);
    }

    const user: UserDocument = await this.userService.findOne(authUser);
    if (!user.role.permissions.includes(RolePermission.ARTICLE_READ_OTHER)) {
      if (data.author.toString() !== authUser) {
        throw new UnauthorizedException([
          'you are not allowed to read this article',
        ]);
      }
    }

    return data;
  }

  async findOneBy(
    key: string,
    value: string,
    authUser: string,
  ): Promise<Article> {
    const data: ArticleDocument = await this.articleModel
      .findOne({ [key]: value })
      .populate([
        {
          path: 'categories',
        },
        {
          path: 'author',
          select: ['name', 'id', 'avatar'],
        },
      ]);

    if (!data) {
      throw new NotFoundException(['article not found']);
    }

    const user: UserDocument = await this.userService.findOne(authUser);
    if (!user.role.permissions.includes(RolePermission.ARTICLE_READ_OTHER)) {
      if (data.author.toString() !== authUser) {
        throw new UnauthorizedException([
          'you are not allowed to read this article',
        ]);
      }
    }

    return data;
  }

  async updateById(
    id: string,
    updateArticleDto: UpdateArticleDto,
    authUser: string,
  ): Promise<Article> {
    const data: ArticleDocument = await this.articleModel.findById(id);

    if (!data) {
      throw new NotFoundException(['article not found']);
    }

    const user: UserDocument = await this.userService.findOne(authUser);
    if (!user.role.permissions.includes(RolePermission.ARTICLE_UPDATE_OTHER)) {
      if (data.author.toString() !== authUser) {
        throw new UnauthorizedException([
          'you are not allowed to update this article',
        ]);
      }
    }

    const validCategories = await this.categoryService.getExistsIdOnly(
      updateArticleDto.categories,
    );
    const dto = {
      ...updateArticleDto,
      categories: validCategories,
    };
    return await data.update(dto);
  }

  async remove(id: string, authUser?: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['invalid id']);
    }

    const data: ArticleDocument = await this.articleModel.findById(id);

    if (!data) {
      throw new NotFoundException(['article not found']);
    }

    const user: UserDocument = await this.userService.findOne(authUser);
    if (!user.role.permissions.includes(RolePermission.ARTICLE_DELETE_OTHER)) {
      if (data.author.toString() !== authUser) {
        throw new UnauthorizedException([
          'you are not allowed to delete this article',
        ]);
      }
    }

    return await this.articleModel.deleteById(id, authUser);
  }
}
