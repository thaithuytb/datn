import { Garden } from '@prisma/client';

export interface GardensType {
  statusCode: number;
  success: boolean;
  data: Garden[];
}

export interface GardenDetailType {
  statusCode: number;
  success: boolean;
  data: GardenDetail;
}

export interface GardenDetail extends Garden {
  fans: {
    ip: string;
  };
  pums: {
    ip: string;
  };
  nebulizers: {
    ip: string;
  };
  humis: {
    ip: string;
  };
  lights: {
    ip: string;
  };
  tempAirs: {
    ip: string;
  };
}

export interface Gardens {
  gardens: Garden[] | [];
}
