---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/<%= h.inflection.singularize(moduleName) %>.service.spec.ts
---

import { Test, TestingModule } from '@nestjs/testing';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service } from './<%= h.inflection.singularize(moduleName) %>.service';

describe('<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service', () => {
  let service: <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service],
    }).compile();

    service = module.get<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service>(<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
