export interface IGetThresholds {
  gardenId: number;
}

export enum ThresholdNameEnum {
  LIGHTSENSOR = "LIGHT_SENSOR",
  HUMISENSOR = "HUMIDITY_SENSOR",
  TEMPAIRSENSOR = "TEMPERATURE_HUMIDITY_AIR_SENSOR",
}

export enum Type {
  FAN = 'FAN',
  LAMP = 'LAMP',
  CURTAIN = 'CURTAIN',
  PUMP = 'PUMP',
  LIGHT_SENSOR = 'LIGHT_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  TEMPERATURE_HUMIDITY_AIR_SENSOR = 'TEMPERATURE_HUMIDITY_AIR_SENSOR',
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
  name: Type;
  lowThreshold: number[];
  highThreshold: number[];
  updatedAt: string;
}

export interface IChangeThresholdDto {
  lowThreshold: number[];
  highThreshold: number[];
  name: Type;
}
