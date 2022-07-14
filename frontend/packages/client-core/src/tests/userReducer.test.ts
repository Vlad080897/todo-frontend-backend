import userReducer, { UserStateType } from "../reducers/userReducer";
import { UserType } from "../types/todoTypes";
import { LOG_IN, LOG_OUT } from './../actions/actionsNames';
import { authActions } from './../actions/authActions';

const state = {
  user: null as UserType | null,
  error: null as null | string,
  loading: false
}

describe('userReducer', () => {
  let newState: UserStateType
  beforeEach(() => {
    newState = state;
  })

  test(`${LOG_IN.REQUEST}: loading should be truthy `, () => {
    newState = userReducer(state, authActions.getUserAuth())
    expect(newState.loading).toBeTruthy();
    expect(newState.user).toBeNull();
    expect(newState.error).toBeNull();
  });
  test(`${LOG_IN.SUCSSES}: should set logged user`, () => {
    newState = userReducer(state, authActions.getUserAuthSucsses({ user: { id: '1', email: 'email@gmail.com' } }));
    expect(newState.user).toBeTruthy();
    expect(newState.user?.id).toEqual('1');
    expect(newState.user?.email).toEqual('email@gmail.com');
    expect(newState.loading).toBeFalsy();
    expect(newState.error).toBeNull();
  })
  test(`${LOG_IN.FAILED}: should set error massage`, () => {
    newState = userReducer(state, authActions.getUserAuthFailed({ massage: 'get user failed' }));
    expect(newState.error).toBeTruthy();
    expect(newState.error).toEqual('get user failed');
  })
  test(`${LOG_OUT.SUCSSES}: should delete all user info from state`, () => {
    newState = userReducer(state, authActions.getUserAuthSucsses({ user: { id: '1', email: 'email@gmail.com' } }));
    newState = userReducer(newState, authActions.logUserOut());
    expect(newState.user).toBeNull();
    expect(newState.loading).toBeFalsy();
    expect(newState.error).toBeNull();
  })
})