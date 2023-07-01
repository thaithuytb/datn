export interface IGetThresholds {
  gardenId: number;
}

export enum ThresholdNameEnum {
  LIGHTSENSOR = "LIGHTSENSOR",
  HUMISENSOR = "HUMISENSOR",
  TEMPAIRSENSOR = "TEMPAIRSENSOR",
}

export interface IThresholdServer {
  id: number;
  name: string;
  lowThreshold: string;
  highThreshold: string;
  updatedAt: string;
}

export interface IThreshold {
  id: number;
  name: ThresholdNameEnum;
  lowThreshold: number[];
  highThreshold: number[];
  updatedAt: string;
}

export interface IChangeThresholdDto {
  lowThreshold: number[];
  highThreshold: number[];
  name: ThresholdNameEnum;
}
