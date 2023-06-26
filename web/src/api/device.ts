import { DeviceTypeEnum } from "../types/enum.type";
import { ApiResponse } from "./auth";
import axiosClient from "./axiosClient";

class DeviceApi {
  getDevicesByGardenId(dto: { gardenId: string }) {
    const url = `/devices/${dto.gardenId}`;
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  changeDeviceStatus(
    dto: {
      status?: boolean;
      ip: string;
      deviceId: number;
      type: DeviceTypeEnum;
    },
    gardenId: string
  ) {
    const url = `/devices/change-device/${gardenId}`;
    return axiosClient.post(url, { dto });
  }

  changeThreshold(dto: {
    deviceId: any;
    ip: any;
    lowerThreshold: any;
    highThreshold: any;
  }) {
    const url = `/gardens/change-threshold`;
    return axiosClient.post(url, { dto: dto }) as unknown as ApiResponse;
  }

  static registerDeviceApi() {
    return new DeviceApi();
  }
}

export default DeviceApi;
