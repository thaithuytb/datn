import { Garden } from '@prisma/client';

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
