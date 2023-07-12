import { IChangeThresholdDto, IGetThresholds } from "../types/threshold";
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

  changeThreshold(dto: IChangeThresholdDto) {
    const url = `/thresholds/change-threshold`;
    // validation
    return axiosClient.post(url, { dto }) as unknown as ApiResponse;
  }

  static registerThresholdApi() {
    return new ThresholdApi();
  }
}

export default ThresholdApi;
