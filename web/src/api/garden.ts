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

  changeStatusGarden(dto: {
    id: string;
    req: { isAuto: boolean; time: string };
  }) {
    const url = `/gardens/${dto.id}/regime`;
    return axiosClient.post(url, { dto: dto.req }) as unknown as ApiResponse;
  }

  static registerAuthApi() {
    return new GardenApi();
  }
}

export default GardenApi;
