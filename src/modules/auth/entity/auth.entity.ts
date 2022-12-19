import { Role } from 'src/modules/role/entities/role.entity';

export interface AuthState {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}
