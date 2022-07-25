import { RootState } from '../redux/store';

export const getStateSelector = (state: RootState) => {
  return state.todoReducer
}
export const getTasksSelector = (state: RootState) => {
  return state.todoReducer.tasks
}

export const getLoadingSelector = (state: RootState) => {
  return state.todoReducer.loading
}

export const getAllTasksLength = (state: RootState) => {
  return state.todoReducer.tasks.length
}

export const getError = (state: RootState) => {
  return state.todoReducer.error
}

export const getLoginError = (state: RootState) => {
  return state.userReducer.error
}