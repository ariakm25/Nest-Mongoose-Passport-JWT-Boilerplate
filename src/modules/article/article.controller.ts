import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { AuthState } from '../auth/entity/auth.entity';
import { User } from 'src/common/decorators/user.decorator';

@Controller('articles')
@ApiTags('Article')
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_CREATE)
  @ApiBearerAuth()
  create(@Body() createArticleDto: CreateArticleDto, @User() user: AuthState) {
    return this.articlesService.create(createArticleDto, user.id);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_READ)
  @ApiBearerAuth()
  findAll(@Query() queryArticleDto: QueryArticleDto, @User() user: AuthState) {
    return this.articlesService.findAll(queryArticleDto, user.id);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_READ)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @User() user: AuthState) {
    return this.articlesService.findOne(id, user.id);
  }

  @Patch()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_UPDATE)
  @ApiBearerAuth()
  update(@Body() updateArticleDto: UpdateArticleDto, @User() user: AuthState) {
    return this.articlesService.updateById(
      updateArticleDto.id,
      updateArticleDto,
      user.id,
    );
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.ARTICLE_DELETE)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @User() user: AuthState) {
    return this.articlesService.remove(id, user.id);
  }
}
