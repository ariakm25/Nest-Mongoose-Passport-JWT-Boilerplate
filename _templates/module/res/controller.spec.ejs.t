---
to: src/modules/<%= h.inflection.singularize(moduleName) %>/<%= h.inflection.singularize(moduleName) %>.controller.spec.ts
---

import { Test, TestingModule } from '@nestjs/testing';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller } from './<%= h.inflection.singularize(moduleName) %>.controller';
import { <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service } from './<%= h.inflection.singularize(moduleName) %>.service';

describe('<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller', () => {
  let controller: <%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller],
      providers: [<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Service],
    }).compile();

    controller = module.get<<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller>(<%= h.inflection.camelize(h.inflection.singularize(moduleName.toLowerCase())) %>Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
