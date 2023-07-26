import { Type } from "../pages/StatusGarden";
import { IGetThresholds } from "../types/threshold";
import axiosClient from "./axiosClient";

export interface ApiResponse {
  success: boolean;
  data: any;
  message?: string; //Error
  statusCode?: number; //Error
}

class ThresholdApi {
  getThreshold(dto: IGetThresholds) {
    const url = `/thresholds/${dto.gardenId}`;
    // validation
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  changeThreshold(dto: {
    lowThreshold: number[];
    highThreshold: number[];
    name: Type;
  }) {
    const url = `/thresholds/change-threshold`;
    // validation
    return axiosClient.post(url, { dto }) as unknown as ApiResponse;
  }

  static registerThresholdApi() {
    return new ThresholdApi();
  }
}

export default ThresholdApi;
