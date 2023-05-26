import { ApiResponse } from "./auth";
import axiosClient from "./axiosClient";

class DeviceApi {
  getGardens() {
    const url = "/gardens";
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  getDevicesByGardenId(dto: { gardenId: string }) {
    const url = `/devices/${dto.gardenId}`;
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  static registerDeviceApi() {
    return new DeviceApi();
  }
}

export default DeviceApi;
