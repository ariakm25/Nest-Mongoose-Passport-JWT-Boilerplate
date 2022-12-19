---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/dto/query-<%= h.inflection.singularize(moduleName) %>.dto.ts
---

import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document } from '../entities/<%= h.inflection.singularize(moduleName) %>.entity';

export class Query<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Dto {<% schemaFields.forEach(function(schemaField) { %><% var field = schemaField.split(':')[0] %><% var type = schemaField.split(':')[1] %>
  <%= field %>?: <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Document['<%= field %>'];<% }) %>
  page?: number;
  limit?: number;
}
