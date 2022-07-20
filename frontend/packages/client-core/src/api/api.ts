import axios, { AxiosError } from 'axios';
import { ServerResponse } from '../enums/todoEnums';
import { authApi } from './authApi';

const $axios = axios.create({
  withCredentials: true,
})

$axios.interceptors.response.use((config) => {
  return config
}, async (err: AxiosError) => {
  const originalRequest = err.config;
  if (err.response?.status === ServerResponse.NOT_AUTH) {
    try {
      const refreshToken = localStorage.getItem('jwt-refresh')
      const response = await authApi.getNewToken(refreshToken);
      if (response) {
        return $axios.request(originalRequest)
      }
    } catch (error) {
      throw err
    }
  }
  throw err;
})

export default $axios