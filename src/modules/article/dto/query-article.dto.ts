export class QueryArticleDto {
  title?: string;
  status?: string;
  categories?: Array<string>;
  sort?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}
