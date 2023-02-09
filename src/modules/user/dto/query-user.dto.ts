import { UserDocument } from '../entities/user.entity';

export class QueryUserDto {
  name?: UserDocument['name'];
  email?: UserDocument['email'];
  roleId?: string;
  page?: number;
  limit?: number;
}
