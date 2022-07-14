import App from "../App";
import Login from "../components/Login";

export const all = 'all';
export const active = 'active';
export const completed = 'completed';
export const login = 'login';

export const publicRoutes = [
  {
    path: '/',
    component: App
  },
  {
    path: `/${all}`,
    component: App
  },
  {
    path: `/${active}`,
    component: App
  },
  {
    path: `/${completed}`,
    component: App
  },

]

export const privateRoutes = [
  {
    path: `/${login}`,
    component: Login
  }
]