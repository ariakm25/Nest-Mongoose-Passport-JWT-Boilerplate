import { IsEnum, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  thumbnail: string;

  @IsOptional()
  content: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'PINNED'], {
    message: 'status must be one of (DRAFT | PUBLISHED | PINNED)',
  })
  status: string;

  @IsOptional()
  categories: Array<string>;
}
