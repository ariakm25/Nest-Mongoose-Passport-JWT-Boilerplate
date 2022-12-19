---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/dto/create-<%= h.inflection.singularize(moduleName) %>.dto.ts
---

import { IsNotEmpty } from 'class-validator';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document } from '../entities/<%= h.inflection.singularize(moduleName) %>.entity';

export class Create<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto {<% schemaFields.forEach(function(schemaField) { %><% var field = schemaField.split(':')[0] %><% var type = schemaField.split(':')[1] %>
  @IsNotEmpty()
  <%= field %>: <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document['<%= field %>'];<% }) %>
}
