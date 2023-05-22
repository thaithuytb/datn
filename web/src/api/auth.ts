import { IInformationUserLogin } from "../types/login.type";
import axiosClient from "./axiosClient";

class AuthApi {
  login(dto: IInformationUserLogin) {
    const url = "/auth/login";
    // validation
    return axiosClient.post(url, { dto });
  }

  static registerAuthApi() {
    return new AuthApi()
  }
}

export default AuthApi;

