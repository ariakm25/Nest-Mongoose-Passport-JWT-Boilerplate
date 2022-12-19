---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/<%= h.inflection.singularize(moduleName) %>.controller.ts
---

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service } from './<%= h.inflection.singularize(moduleName) %>.service';
import { Create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto } from './dto/create-<%= h.inflection.singularize(moduleName) %>.dto';
import { Update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto } from './dto/update-<%= h.inflection.singularize(moduleName) %>.dto';
import { Query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto } from './dto/query-<%= h.inflection.singularize(moduleName) %>.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('<%= moduleName.toLowerCase() %>')
@ApiTags('<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>')
export class <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller {
  constructor(private readonly <%= moduleName.toLowerCase() %>Service: <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service) {}

  @Post()
  create(@Body() create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto: Create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto) {
    return this.<%= moduleName.toLowerCase() %>Service.create(create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto);
  }

  @Get()
  findAll(@Query() query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto: Query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto) {
    return this.<%= moduleName.toLowerCase() %>Service.findAll(query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.<%= moduleName.toLowerCase() %>Service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto: Update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto) {
    return this.<%= moduleName.toLowerCase() %>Service.updateById(id, update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.<%= moduleName.toLowerCase() %>Service.remove(id);
  }
}
