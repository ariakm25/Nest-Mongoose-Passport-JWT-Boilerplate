import { IsDefined, IsOptional } from 'class-validator';
import { CategoryDocument } from '../entities/category.entity';

export class UpdateCategoryDto {
  @IsDefined()
  id: string;
  @IsOptional()
  name: CategoryDocument['name'];
  @IsOptional()
  slug: CategoryDocument['slug'];
}
