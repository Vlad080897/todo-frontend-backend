import axios from "axios";
import $axios from "./api";

export const authApi = {
  getUser: () => {
    return $axios.get('/api/todos/auth').then(res => res);
  },
  signup: (email: string, password: string) => {
    return $axios.post('/api/todos/signup', { email, password }).then(res => res);
  },
  login: (email: string, password: string) => {
    return $axios.post('/api/todos/login', { email, password }).then(res => res);
  },
  logout: () => {
    return $axios.get('/api/todos/logout');
  },
  getNewToken: (refreshToken: string | null) => {
    return axios.post('/api/todos/token', { refreshToken }).then(res => res.data);
  }
}