import { CategoryDocument } from '../entities/category.entity';

export class QueryCategoryDto {
  name?: CategoryDocument['name'];
  slug?: CategoryDocument['slug'];
  page?: number;
  limit?: number;
}
