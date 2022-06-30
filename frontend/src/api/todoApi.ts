import { AxiosResponse } from "axios";
import { TaskType } from './../types/todoTypes';
import $axios from "./api";


export const todoApi = {
  getTasks: (userId: string) => {
    return $axios.get<AxiosResponse<ResponseType[], any>>(`/api/todos/${userId}`).then(res => res);
  },
  deleteTask: (_id: string) => {
    return $axios.delete<AxiosResponse<ResponseType, any>>(`/api/todos/${_id}`).then(res => res);
  },
  addNewTasks: (newTask: TaskType) => {
    return $axios.post<AxiosResponse<ResponseType, any>>('/api/todos/', { ...newTask }).then(res => res)
  },
  completeTask: (id: string, completedValue: boolean) => {
    return $axios.patch<AxiosResponse<ResponseType, any>>(`/api/todos/${id}`, { completed: completedValue });
  },
  clearCompleted: () => {
    return $axios.patch('api/todos/clear').then(res => res);
  },
  checkAll: (completedValue: boolean) => {
    return $axios.patch('api/todos/check_all', { completedValue }).then(res => res)
  },
  toggleEditMode: (id: string, editMode: boolean) => {
    return $axios.patch(`api/todos/${id}`, { isEdit: !editMode })
  },
  updateValue: (id: string, isEdit: boolean, description: string) => {
    return $axios.patch(`api/todos/${id}`, { isEdit: !isEdit, description })
  },
}

type ResponseType = {
  completed: boolean
  createdAt: string
  description: string
  isEdit: boolean
  updatedAt: string
  __v: number
  _id: string
}