import { FanData } from '@prisma/client';

export interface FanDatasType {
  statusCode: number;
  success: boolean;
  data: FanData[];
}

export interface FanDataType {
  statusCode: number;
  success: boolean;
  data: FanData;
}
