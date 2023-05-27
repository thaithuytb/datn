import { DeviceTypeEnum } from "./enum.type";

export interface Device {
  id: number;
  ip: string;
  status: boolean;
  type: DeviceTypeEnum;
  valueDevice?: any;
}
