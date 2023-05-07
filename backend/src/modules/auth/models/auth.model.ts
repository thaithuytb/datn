import { User } from '@prisma/client';

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
