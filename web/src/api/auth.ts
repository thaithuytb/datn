import { IInformationUserLogin } from "../types/login.type";
import axiosClient from "./axiosClient";

export interface ApiResponse {
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

  createAccount(dto: {
    email: any;
    password: any;
    confirmPassword: any;
    fullName?: any;
    phoneNumber?: any;
    address?: any;
  }) {
    const url = "/auth/register";
    // validation
    return axiosClient.post(url, { dto }) as unknown as ApiResponse;
  }

  updateUnformation(dto: {
    password?: string;
    newPassword?: string;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
  }) {
    const url = "/auth/update-information";
    // validation
    return axiosClient.patch(url, {
      dto: { ...dto },
    }) as unknown as ApiResponse;
  }

  //getUser garden byID
  getUsersByGardenId(dto: { gardenId: number }) {
    const url = `/auth/users/${dto.gardenId}`;
    // validation
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  //getUser garden byID
  upsertGardensOnUser(dto: {
    gardenId?: number;
    userId?: number;
    role?: string;
  }) {
    const url = `/auth/upsert-gardens-on-users`;
    // validation
    return axiosClient.post(url, {
      dto: { ...dto },
    }) as unknown as ApiResponse;
  }

  static registerAuthApi() {
    return new AuthApi();
  }
}

export default AuthApi;
