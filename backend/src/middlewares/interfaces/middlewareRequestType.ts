import { User } from '@prisma/client';
import { Request } from 'express';

export interface MiddlewareRequestType extends Request {
  user?: User;
}
