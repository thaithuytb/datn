import { IInformationUserLogin } from "../types/login.type";
import axiosClient from "./axiosClient";

interface ApiResponse {
  success: boolean;
  data: any;
  message?: string; //Error
  statusCode?: number; //Error
}


class AuthApi {
  login(dto: IInformationUserLogin) {
    const url = "/auth/login";
    // validation
    return axiosClient.post(url, { dto }) as unknown as ApiResponse;
  }

  autoLogin() {
    const url = "/auth/verify-token";
    // validation
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  static registerAuthApi() {
    return new AuthApi()
  }
}

export default AuthApi;

