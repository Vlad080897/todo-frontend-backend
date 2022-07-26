import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import commonStore from '../commonStore/commonStore';
import { ServerResponse } from '../enums/todoEnums';
import { authApi } from './authApi';

export const changeAxiosInstance = (url: string) => {
  $axios.defaults.baseURL = url
}

let $axios = axios.create({
  withCredentials: true,
})

$axios.interceptors.response.use((config) => {
  return config
}, async (err: AxiosError) => {
  const originalRequest: customConfig = err.config;
  debugger
  if (err.response) {
    if (err.response.status === ServerResponse.INCORRECT_TOKEN && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await commonStore.getItem('jwt-refresh');
        const response  = await authApi.getNewToken(refreshToken);
        console.log(response);
        
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