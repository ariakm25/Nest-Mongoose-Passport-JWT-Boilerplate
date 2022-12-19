---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/dto/update-<%= h.inflection.singularize(moduleName) %>.dto.ts
---

import { IsOptional } from 'class-validator';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document } from '../entities/<%= h.inflection.singularize(moduleName) %>.entity';

export class Update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto {<% schemaFields.forEach(function(schemaField) { %><% var field = schemaField.split(':')[0] %><% var type = schemaField.split(':')[1] %>
  @IsOptional()
  <%= field %>: <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document['<%= field %>'];<% }) %>
}
