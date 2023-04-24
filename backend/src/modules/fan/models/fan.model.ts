import { Fan } from '@prisma/client';

export interface FansType {
  statusCode: number;
  success: boolean;
  data: Fan[];
}

export interface FanType {
  statusCode: number;
  success: boolean;
  data: Fan;
}
