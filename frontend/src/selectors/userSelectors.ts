import { RootState } from './../redux/store';

export const getUserSelector = (state: RootState) => {
  return state.userReducer.user;
}

export const getUserIdSelector = (state: RootState) => {
  return state.userReducer.user?.id;
}

export const getError = (state: RootState) => {
  return state.userReducer.error;
}

export const getLoading = (state: RootState) => {
  return state.userReducer.loading;
}