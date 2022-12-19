import { UserDocument } from '../entities/user.entity';

export class QueryUserDto {
  name?: UserDocument['name'];
  email?: UserDocument['email'];
  role?: UserDocument['role'];
  page?: number;
  limit?: number;
}
