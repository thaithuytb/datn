import { DeviceTypeEnum } from "./enum.type";

export interface Device {
  id: number
  type: string
  createdAt: string
  duration: string
  endAt: string
  gardenId: number
  ip: string
  isDeleted: boolean
  startAt: string
  status: boolean
  time: string
  updatedAt: string
  valueDevice: any
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
