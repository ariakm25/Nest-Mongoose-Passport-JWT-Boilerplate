import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, isValidObjectId } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: PaginateModel<CategoryDocument>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    const category = new this.categoryModel(createCategoryDto);
    return await category.save();
  }

  async findAll(
    queryCategoryDto: QueryCategoryDto,
  ): Promise<PaginateResult<CategoryDocument>> {
    const query: any = {};
    if (queryCategoryDto.name) {
      query.name = {
        $regex: '.*' + queryCategoryDto.name + '.*',
        $options: 'i',
      };
    }

    if (queryCategoryDto.slug) {
      query.slug = {
        $regex: '.*' + queryCategoryDto.slug + '.*',
        $options: 'i',
      };
    }

    const options = {
      page: queryCategoryDto.page || 1,
      limit: queryCategoryDto.limit <= 120 ? queryCategoryDto.limit : 24,
    };

    return await this.categoryModel.paginate(query, options);
  }

  async findOne(slug: string): Promise<CategoryDocument> {
    const data: CategoryDocument = await this.categoryModel.findOne({ slug });

    if (!data) {
      throw new NotFoundException(['category not found']);
    }
    return data;
  }

  async findOneBy(key: string, value: string): Promise<CategoryDocument> {
    return await this.categoryModel.findOne({ [key]: value });
  }

  async updateById(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<CategoryDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['invalid id']);
    }
    return await this.categoryModel.findByIdAndRemove(id);
  }

  async getExistsIdOnly(ids: Array<string>): Promise<string[]> {
    const existsId: string[] = [];
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      if (!isValidObjectId(id)) {
        continue;
      }
      const checkExist = await this.categoryModel.findById(id);
      if (checkExist) {
        existsId.push(id);
      }
    }
    return existsId;
  }
}
