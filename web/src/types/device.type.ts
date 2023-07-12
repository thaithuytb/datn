import { DeviceTypeEnum } from "./enum.type";

export interface Device {
  id: number;
  ip: string;
  status: boolean;
  type: DeviceTypeEnum;
  garden: any;
  valueDevice?: any;
  lowThreshold?: any;
  highThreshold?: any;
}

export const DEVICE_TYPE = {
  FAN: "Quạt",
  LAMP: "Đèn",
  CURTAIN: "Rèm",
  PUMP: "Máy bơm",
  LIGHTSENSOR: "Cảm biến ánh sáng",
  HUMISENSOR: "Cảm biến độ ẩm đất",
  TEMPAIRSENSOR: "Cảm biến nhiệt độ, độ ẩm",
} as const;

export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

export const convertDevice2Type = (deviceType: DeviceTypeEnum) => {
  switch (deviceType) {
    case "FAN":
    case "LAMP":
    case "CURTAIN":
    case "PUMP": {
      return "ACTUATOR";
    }
    default:
      return "SENSOR";
  }
};
