import { IsOptional } from 'class-validator';
import { CategoryDocument } from '../entities/category.entity';

export class UpdateCategoryDto {
  @IsOptional()
  name: CategoryDocument['name'];
  @IsOptional()
  slug: CategoryDocument['slug'];
}
