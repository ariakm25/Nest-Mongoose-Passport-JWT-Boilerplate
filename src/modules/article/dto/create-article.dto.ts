import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  thumbnail: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsEnum(['DRAFT', 'PUBLISHED', 'PINNED'], {
    message: 'status must be one of (DRAFT | PUBLISHED | PINNED)',
  })
  status: string;

  @IsOptional()
  categories: Array<string>;
}
