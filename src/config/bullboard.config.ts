import { registerAs } from '@nestjs/config';

export default registerAs('bullboard', () => ({
  username: process.env.BULLBOARD_USER || 'admin',
  password: process.env.BULLBOARD_PASSWORD || 'password',
}));
