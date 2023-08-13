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

  createGarden(dto: {
    name: string,
    address: string
    width?: number,
    length?: number,
    hight?: number,
    landArea: number,
  }) {
  const url = `/gardens/create`;
  return axiosClient.post(url, { dto: { ...dto } }) as unknown as ApiResponse;
}

changeStatusGarden(dto: {
  id: string;
  body: { isAuto: boolean; time?: string };
}) {
  const url = `/gardens/${dto.id}/regime`;
  return axiosClient.post(url, { dto: dto.body }) as unknown as ApiResponse;
}

changeGarden(dto: {
  id?:number,
  name?: string,
  address?: string,
  width?: number;
  length?: number;
  hight?: number;
  landArea?: number;
}) {
  const url = `/gardens/update`;
  return axiosClient.post(url, { dto: { ...dto } }) as unknown as ApiResponse;
}

deleteGarden(dto: { id: number }) {
  const url = `/gardens/delete`;
  return axiosClient.post(url, { dto }) as unknown as ApiResponse;
}

  static registerAuthApi() {
  return new GardenApi();
}
}

export default GardenApi;