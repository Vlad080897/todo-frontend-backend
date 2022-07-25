import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import commonStore from '../commonStore/commonStore';
import { ServerResponse } from '../enums/todoEnums';
import { authApi } from './authApi';

const $axios = axios.create({
  withCredentials: true,
  baseURL: "http://10.0.2.2:8000"
  //http://10.0.2.2:8000
  //http://localhost:8000
})

$axios.interceptors.response.use((config) => {
  return config
}, async (err: AxiosError) => {
  const originalRequest: customConfig = err.config;
  if (err.response) {
    if (err.response.status === ServerResponse.INCORRECT_TOKEN && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await commonStore.getItem('jwt-refresh');
        await authApi.getNewToken(refreshToken);
        return $axios.request(originalRequest)
      } catch (error) {
        throw err
      }
    }
    return Promise.reject(err);

  }
  throw err;
})

export default $axios

interface customConfig extends AxiosRequestConfig {
  _retry?: boolean
}