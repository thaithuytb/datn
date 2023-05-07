import { Garden, User } from '@prisma/client';

export interface LoginType {
  statusCode: number;
  success: boolean;
  data: Login;
}

export interface Login {
  user: User;
  // TODO: can returns refresh token
  token: string;
}

export interface UserDetail extends User {
  gardens: Garden[];
}
