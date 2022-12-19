import { IsNotEmpty } from 'class-validator';
import { CategoryDocument } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: CategoryDocument['name'];
}
