import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../role/decorators/require-permissions.decorators';
import { RolePermission } from '../role/entities/role.entity';

@Controller('articles')
@ApiTags('Article')
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_CREATE)
  @ApiBearerAuth()
  create(@Body() createArticleDto: CreateArticleDto, @Req() request: any) {
    return this.articlesService.create(createArticleDto, request.user.id);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_READ)
  @ApiBearerAuth()
  findAll(@Query() queryArticleDto: QueryArticleDto, @Req() request: any) {
    return this.articlesService.findAll(queryArticleDto, request.user.id);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_READ)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Req() request: any) {
    return this.articlesService.findOne(id, request.user.id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_UPDATE)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() request: any,
  ) {
    return this.articlesService.updateById(
      id,
      updateArticleDto,
      request.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_DELETE)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() request: any) {
    return this.articlesService.remove(id, request.user.id);
  }
}
