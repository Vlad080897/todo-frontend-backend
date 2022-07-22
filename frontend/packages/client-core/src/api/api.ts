import axios, { AxiosError } from "axios";
import commonStore from "../commonStore/commonStore";
import { ServerResponse } from "../enums/todoEnums";
import { authApi } from "./authApi";

const $axios = axios.create({
  withCredentials: true,
  baseURL: "http://192.168.0.104:8000",
});

$axios.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err: AxiosError) => {
    const originalRequest = err.config;
    if (err.response?.status === ServerResponse.NOT_AUTH) {
      try {
        const refreshToken = commonStore.getItem("jwt-refresh");
        const response = await authApi.getNewToken(refreshToken as string);
        if (response) {
          return $axios.request(originalRequest);
        }
      } catch (error) {
        throw err;
      }
    }
    throw err;
  }
);

export default $axios;
