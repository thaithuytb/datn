import { Request } from 'express';
import { UserDetail } from '../../modules/auth/models/auth.model';

export interface MiddlewareRequestType extends Request {
  user?: UserDetail;
}
