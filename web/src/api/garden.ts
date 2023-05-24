import { ApiResponse } from "./auth";
import axiosClient from "./axiosClient";

class GardenApi {
  getGardens() {
    const url = "/gardens";
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  getGardenById(dto: { id: string }) {
    const url = `/gardens/${dto.id}`;
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  static registerAuthApi() {
    return new GardenApi();
  }
}

export default GardenApi;
