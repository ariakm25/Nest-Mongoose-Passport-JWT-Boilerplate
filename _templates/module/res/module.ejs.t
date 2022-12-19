---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/<%= h.inflection.singularize(moduleName) %>.module.ts
---

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service } from './<%= h.inflection.singularize(moduleName) %>.service';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller } from './<%= h.inflection.singularize(moduleName) %>.controller';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>, <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Schema } from './entities/<%= h.inflection.singularize(moduleName) %>.entity';
import mongoosePaginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>.name,
        useFactory: () => {
          const schema = <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Schema;

          schema.plugin(mongoosePaginate);

          return schema;
        },
      },
    ]),
  ],
  controllers: [<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller],
  providers: [<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service],
  exports: [<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service],
})
export class <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Module {}
