---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/entities/<%= h.inflection.singularize(moduleName) %>.entity.ts
---

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document = HydratedDocument<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>>;

@Schema()
export class <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %> {<% schemaFields.forEach(function(schemaField) { %><% var field = schemaField.split(':')[0] %><% var type = schemaField.split(':')[1] %>
  @Prop()
  <%= field %>: <%= type %>;<% }) %>
}

export const <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Schema = SchemaFactory.createForClass(<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>);
