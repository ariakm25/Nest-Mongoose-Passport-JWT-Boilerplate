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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolePermission } from '../role/entities/role.entity';
import { RequirePermissions } from '../role/decorators/require-permissions.decorators';

@Controller('categories')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.CATEGORY_CREATE)
  @ApiBearerAuth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() queryCategoryDto: QueryCategoryDto) {
    return this.categoriesService.findAll(queryCategoryDto);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.CATEGORY_UPDATE)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateById(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(RolePermission.CATEGORY_DELETE)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
