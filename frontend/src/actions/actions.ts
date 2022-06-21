import { TaskType } from './../types/todoTypes';
import {
  ADD_SUCSSES,
  CHECK_ALL_SUCSSES,
  CLEAR_SUCSSES,
  COMPLETE_TASK_SUCSSES,
  DELETE_SUCSSES,
  GETTING_RESPONSE,
  GET_ITEMS_LEFT,
  GET_TASKS_FAILED,
  GET_TASKS_SUCSSES,
  TOGGLE_EDIT_MODE
} from './actionsNames';


export const actions = {
  gettingResponse: () => {
    return {
      type: GETTING_RESPONSE
    } as const
  },
  getTasksSucsses: (payload: TaskType[]) => {
    return {
      type: GET_TASKS_SUCSSES,
      payload
    } as const
  },
  getTasksFailed: (payload: string) => {
    return {
      type: GET_TASKS_FAILED,
      payload
    } as const
  },
  deleteTask: (payload: TaskType) => {
    return {
      type: DELETE_SUCSSES,
      payload
    } as const
  },
  addNewTasks: (payload: TaskType) => {
    return {
      type: ADD_SUCSSES,
      payload
    } as const
  },
  completeTask: (id: string) => {
    return {
      type: COMPLETE_TASK_SUCSSES,
      id
    } as const
  },
  clearCompleted: (newTasks: TaskType[]) => {
    return {
      type: CLEAR_SUCSSES,
      newTasks
    } as const
  },
  checkAll: (newTasks: TaskType[]) => {
    return {
      type: CHECK_ALL_SUCSSES,
      newTasks
    } as const
  },
  getItemsLeft: () => {
    return {
      type: GET_ITEMS_LEFT,
    } as const
  },
  toggleEditMode: (id: string, description: string) => {
    return {
      type: TOGGLE_EDIT_MODE,
      id,
      description
    } as const
  }
}


