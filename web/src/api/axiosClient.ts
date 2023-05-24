import axios from "axios";
import queryString from "query-string";
import { LOCAL_STORAGE_TOKEN } from "../common/local-storage-token";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response: any) => {
    if (response?.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if(error?.response?.data) {
      throw error?.response?.data
    }
    throw error;
  }
);

export default axiosClient;