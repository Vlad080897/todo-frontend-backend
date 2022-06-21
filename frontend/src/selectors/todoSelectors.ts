import { RootState } from './../redux/store';

export const getStateSelector = (state: RootState) => {
  return state.todoReducer
}
export const getTasksSelector = (state: RootState) => {
  return state.todoReducer.tasks
}

export const getItemsLeftSelector = (state: RootState) => {
  return state.todoReducer.itemsLeft;
}

export const getLoadingSelector = (state: RootState) => {
  return state.todoReducer.loading
}

export const getAllTasksLength = (state: RootState) => {
  return state.todoReducer.tasks.length
}