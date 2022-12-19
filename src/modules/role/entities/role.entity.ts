import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

export enum RolePermission {
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  ROLE_CREATE = 'role:create',
  ROLE_READ = 'role:read',
  ROLE_UPDATE = 'role:update',
  ROLE_DELETE = 'role:delete',

  CATEGORY_CREATE = 'category:create',
  CATEGORY_UPDATE = 'category:update',
  CATEGORY_DELETE = 'category:delete',

  ARTICLE_CREATE = 'article:create',
  ARTICLE_READ = 'article:read',
  ARTICLE_UPDATE = 'article:update',
  ARTICLE_DELETE = 'article:delete',
  ARTICLE_READ_OTHER = 'article:read_other',
  ARTICLE_UPDATE_OTHER = 'article:update_other',
  ARTICLE_DELETE_OTHER = 'article:delete_other',
  ARTICLE_RESTORE = 'article:restore',
  ARTICLE_RESTORE_OTHER = 'article:restore_other',
  ARTICLE_DELETE_FOREVER = 'article:delete_forever',
  ARTICLE_DELETE_FOREVER_OTHER = 'article:delete_forever_other',
}

@Schema()
export class Role {
  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  permissions?: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
