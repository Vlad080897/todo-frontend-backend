import { UserType } from '../types/todoTypes';
import { ActionType, getType } from 'typesafe-actions';
import { actions } from '../actions/todosActions';
import { authActions } from '../actions/authActions';

const initialState = {
  user: null as UserType | null,
  error: null as null | string,
  loading: false

}

const userReducer = (state: UserStateType = initialState, action: ActionType<typeof actions> | ActionType<typeof authActions>) => {
  switch (action.type) {
    case getType(authActions.getUserAuth): {
      return {
        ...state,
        loading: true
      }
    }
    case getType(authActions.getUserAuthSucsses): {
      return {
        ...state,
        user: action.payload ? action.payload.user : null,
        loading: false,
        error: null
      }
    }
    case getType(authActions.getUserAuthFailed): {
      return {
        ...state,
        error: action.payload.massage,
        loading: false
      }
    }
    case getType(authActions.logUserOut): {
      return {
        ...state,
        user: null,
        error: null,
      }
    }
    default: return state
  }
}

export default userReducer;

export type UserStateType = typeof initialState;