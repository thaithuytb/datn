import { ApiResponse } from "./auth";
import axiosClient from "./axiosClient";

class DeviceApi {
  getDevicesByGardenId(dto: { gardenId: string }) {
    const url = `/devices/garden/${dto.gardenId}`;
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  changeDeviceStatus(
    dto: {
      time?: string,
      status?: boolean;
      ip: string;
      deviceId: number;
      type: string;
    },
    gardenId: string
  ) {
    const url = `/devices/change-device/${gardenId}`;
    return axiosClient.post(url, { dto }) as unknown as ApiResponse;
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

  updateDevice(dto: {
    id?: number;
    type?: string;
    duration?: number[];
    time?: string[];
    startAt?: string [];
    endAt?: string[];
  }) {
    const url = `/devices/update`;
    return axiosClient.patch(url, { dto: dto }) as unknown as ApiResponse;
  }

  getDeviceById(dto: { id: number }) {
    const url = `/devices/${dto.id}`;
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  static registerDeviceApi() {
    return new DeviceApi();
  }
}

export default DeviceApi;
