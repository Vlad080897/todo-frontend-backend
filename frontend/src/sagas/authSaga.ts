import axios, { AxiosResponse } from 'axios';
import bcrypt from 'bcryptjs';
import { put, takeEvery } from "redux-saga/effects";
import { ResponseUserType, signUpAndLoginAction } from '../types/todoTypes';
import { GET_USER, LOG_IN, LOG_OUT, SIGN_UP } from './../actions/actionsNames';
import { authActions } from './../actions/authActions';
import { authApi } from './../api/authApi';
import { ServerResponse } from './../enums/todoEnums';

function* getUser() {
  yield put(authActions.getUserAuth());
  try {
    const response: AxiosResponse<ResponseUserType, any> = yield authApi.getUser();
    if (response.status === ServerResponse.SUCSSES) {
      if (response.data) {
        const { _id, email } = response.data;
        yield put(authActions.getUserAuthSucsses({ user: { id: _id, email } }));
        return;
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === ServerResponse.NOT_AUTH) {
        yield put(authActions.getUserAuthSucsses(null));
      }
      console.log(error);
    }
  }
}

function* signUp(payload: signUpAndLoginAction) {
  const { email, password } = payload
  const hashedPass: string = yield hashPassword(password);
  try {
    const response: AxiosResponse<{ id: string, userEmail: string }, any> = yield authApi.signup(email, hashedPass);
    if (response.status === ServerResponse.SUCSSES) {
      const { id, userEmail } = response.data;
      yield put(authActions.getUserAuthSucsses({ user: { id, email: userEmail } }))
    }

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const massage = (error.response.data) as { errors: { email: string, password: string } }
      if (massage.errors.password) {
        yield put(authActions.getUserAuthFailed({ massage: massage.errors.password }));
        return;
      }
      yield put(authActions.getUserAuthFailed({ massage: massage.errors.email }))
    }
    console.log(error);
  }
}

const hashPassword = async (pass: string) => {
  const salt = `$${process.env.REACT_APP_PASSWORD_SALT}`
  const hashedPass = await bcrypt.hash(pass, salt)
  return hashedPass;
}

function* login(payload: signUpAndLoginAction) {
  const { email, password } = payload;
  const hashedPass: string = yield hashPassword(password);

  try {
    const response: AxiosResponse<{ user: ResponseUserType, refreshToken: string }, any> = yield authApi.login(email, hashedPass);
    if (response.status === ServerResponse.SUCSSES) {
      if (response.data) {
        const { _id, email } = response.data.user;
        localStorage.setItem('jwt-refresh', response.data.refreshToken)
        yield put(authActions.getUserAuthSucsses({ user: { id: _id, email } }));
        return;
      }
      yield put(authActions.getUserAuthSucsses(null))
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const massage = (error.response.data as { error: string }).error
      yield put(authActions.getUserAuthFailed({ massage }))
    }
    console.log(error);
  }
}

function* logout() {
  yield authApi.logout();
  yield localStorage.removeItem('jwt-refresh');
  yield put({ type: LOG_OUT.SUCSSES });
}

export default function* autSaga() {
  yield takeEvery(GET_USER.CALL, getUser)
  yield takeEvery(SIGN_UP.CALL, signUp);
  yield takeEvery(LOG_IN.CALL, login);
  yield takeEvery(LOG_OUT.CALL, logout)
}



