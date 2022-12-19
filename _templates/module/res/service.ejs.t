---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/<%= h.inflection.singularize(moduleName) %>.service.ts
---

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, isValidObjectId } from 'mongoose';
import { Create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto } from './dto/create-<%= h.inflection.singularize(moduleName) %>.dto';
import { Query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto } from './dto/query-<%= h.inflection.singularize(moduleName) %>.dto';
import { Update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto } from './dto/update-<%= h.inflection.singularize(moduleName) %>.dto';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>, <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document } from './entities/<%= h.inflection.singularize(moduleName) %>.entity';

@Injectable()
export class <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service {
  constructor(
    @InjectModel(<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>.name)
    private readonly <%= h.inflection.singularize(moduleName.toLowerCase()) %>Model: PaginateModel<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document>,
  ) {}

  async create(create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto: Create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto): Promise<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>> {
    const <%= h.inflection.singularize(moduleName) %> = new this.<%= h.inflection.singularize(moduleName.toLowerCase()) %>Model(create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto);
    return await <%= h.inflection.singularize(moduleName) %>.save();
  }

  async findAll(query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto: Query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto): Promise<PaginateResult<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>>> {
    const query: any = {};<% schemaFields.forEach(function(schemaField) { %><% var field = schemaField.split(':')[0] %><% var type = schemaField.split(':')[1] %>
    if (query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto.<%= field %>) {
      query.<%= field %> = {
        $regex: '.*' + query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto.<%= field %> + '.*', 
        $options: 'i' 
      };
    }
<% }) %>
    const options = {
      page: query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto.page || 1,
      limit: query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto.limit <= 24 ? query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto.limit : 24,
    };

    return await this.<%= h.inflection.singularize(moduleName.toLowerCase()) %>Model.paginate(query, options);
  }

  async findOne(id: string): Promise<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['invalid id']);
    }

    const data = await this.<%= h.inflection.singularize(moduleName.toLowerCase()) %>Model.findOne({ _id: id });

    if (!data) {
      throw new NotFoundException(['<%= h.inflection.singularize(moduleName) %> not found']);
    }
    return data;
  }

  async findOneBy(key: string, value: string): Promise<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>> {
    return await this.<%= h.inflection.singularize(moduleName.toLowerCase()) %>Model.findOne({ [key]: value });
  }

  async updateById(id: string, update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto: Update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto): Promise<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>> {
    return await this.<%= h.inflection.singularize(moduleName.toLowerCase()) %>Model.findByIdAndUpdate(id, update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto);
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['invalid id']);
    }
    return await this.<%= h.inflection.singularize(moduleName.toLowerCase()) %>Model.findByIdAndRemove(id);
  }
}
