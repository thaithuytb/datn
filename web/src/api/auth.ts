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

  updateInformation(dto: {
    password?: string;
    newPassword?: string;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBrith?: string
    gender?: string
  }) {
    const url = "/auth/update-information";
    // validation
    return axiosClient.patch(url, {
      dto: { ...dto },
    }) as unknown as ApiResponse;
  }

  //getUsers: for user and account
  getUsers(dto: { gardenId?: number; page?: number }) {
    let url = `/auth/users`;
    // let url = `/auth/users/${dto.gardenId}`;
    if (dto.gardenId) {
      url = url.concat(`?gardenId=${dto.gardenId}`);
    }
    if (dto.page) {
      if (dto.gardenId) {
        url = url.concat(`&page=${dto.page}`);
      }
      url = url.concat(`?page=${dto.page}`);
    }
    // validation
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  //upsert garden byID
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

  getUsersWithoutGardenId(dto: { gardenId: number }) {
    const url = `/auth/users/without?gardenId=${dto.gardenId}`;
    // validation
    return axiosClient.get(url) as unknown as ApiResponse;
  }

  deleteAcountInGarden(dto: {
    userId: number,
    gardenId: number
  }) {
    // account/delete
    const url = `/auth/account-garden/delete`;
    // validation
    return axiosClient.post(url, { dto: { ...dto } }) as unknown as ApiResponse;
  }

  deleteAcount(dto: {
    userId: number,
  }) {
    const url = `/auth/account/delete`;
    // validation
    return axiosClient.post(url, {dto: {...dto}}) as unknown as ApiResponse;
  }


  static registerAuthApi() {
    return new AuthApi();
  }
}

export default AuthApi;
