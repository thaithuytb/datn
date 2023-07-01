import axiosClient from "./axiosClient";

export interface ApiResponse {
  success: boolean;
  data: any;
  message?: string; //Error
  statusCode?: number; //Error
}

class FileApi {
  uploadAvatar(file?: File) {
    const url = "/upload/avatar";
    const formData = new FormData();
    if (file) {
      formData.append("fileImage", file);
      return axiosClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  }
}

export default FileApi;
