import { DeviceTypeEnum } from "../types/enum.type";
import { ApiResponse } from "./auth";
import axiosClient from "./axiosClient";

class DeviceApi {
  getDevicesByGardenId(dto: { gardenId: string }) {
    const url = `/devices/${dto.gardenId}`;
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  changeDeviceStatus(dto: {
    status?: boolean;
    ip: string;
    deviceId: number;
    type: DeviceTypeEnum;
  }) {
    const url = `/devices/change-device`;
    return axiosClient.post(url, { dto });
  }

  static registerDeviceApi() {
    return new DeviceApi();
  }
}

export default DeviceApi;
