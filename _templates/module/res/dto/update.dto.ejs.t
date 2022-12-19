---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/dto/update-<%= h.inflection.singularize(moduleName) %>.dto.ts
---

import { IsOptional } from 'class-validator';

export class Update<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto {<% schemaFields.forEach(function(schemaField) { %><% var field = schemaField.split(':')[0] %><% var type = schemaField.split(':')[1] %>
  @IsOptional()
  <%= field %>: <%= type %>;<% }) %>
}
