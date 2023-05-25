import { DeviceTypeEnum } from "./enum.type";

export interface Device {
  id: number;
  ip: string;
  type: DeviceTypeEnum;
}
