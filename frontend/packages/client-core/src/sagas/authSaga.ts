import axios, { AxiosResponse } from "axios";
import * as bcrypt from "bcryptjs";
import { put, takeEvery } from "redux-saga/effects";
import { ResponseUserType, signUpAndLoginAction } from "../types/todoTypes";
import { GET_USER, LOG_IN, LOG_OUT, SIGN_UP } from "../actions/actionsNames";
import { authActions } from "../actions/authActions";
import { authApi } from "../api/authApi";
import { ServerResponse } from "../enums/todoEnums";
import commonStore from "../commonStore/commonStore";

export function* getUser() {
  yield put(authActions.getUserAuth());
  try {
    const response: AxiosResponse<ResponseUserType, any> | undefined =
      yield authApi.getUser();
    if (response?.status === ServerResponse.SUCSSES) {
      if (response.data) {
        const { _id, email } = response.data;
        yield put(authActions.getUserAuthSucsses({ user: { id: _id, email } }));
        return;
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === ServerResponse.NOT_AUTH ||
        error.response?.status === ServerResponse.INCORRECT_TOKEN
      ) {
        yield put(authActions.getUserAuthSucsses(null));
        return;
      }
    }
  }
}

export function* signUp(payload: signUpAndLoginAction) {
  const { email, password } = payload;
  if (password.length < 6) {
    yield put(
      authActions.getUserAuthFailed({
        massage: "Pass shouldn't be less than 6 symbols",
      })
    );
    return;
  }
  yield put(authActions.getUserAuth());
  const hashedPass: string = yield hashPassword(password);
  try {
    const response:
      | AxiosResponse<{ id: string; userEmail: string }, any>
      | undefined = yield authApi.signup(email, hashedPass);
    if (response?.status === ServerResponse.SUCSSES) {
      if (response) {
        const { id, userEmail } = response.data;
        yield put(
          authActions.getUserAuthSucsses({ user: { id, email: userEmail } })
        );
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const massage = error.response.data as {
        error: { email: string; password: string };
      };
      if (massage.error.password) {
        yield put(
          authActions.getUserAuthFailed({ massage: massage.error.password })
        );
        return;
      }
      if (massage.error.email) {
        yield put(
          authActions.getUserAuthFailed({ massage: massage.error.email })
        );
        return;
      }
    }
    yield put(
      authActions.getUserAuthFailed({ massage: "Something went wrong" })
    );
  }
}

export const hashPassword = async (pass: string) => {
  const salt = `\$2a\$10$.jlQg/L7FsaBJEOnLMQUYe`;
  const hashedPass = await bcrypt.hash(pass, salt);
  return hashedPass;
};

export function* login(payload: signUpAndLoginAction) {
  const { email, password } = payload;
  const hashedPass: string = yield hashPassword(password);
  yield put(authActions.getUserAuth());
  try {
    const response:
      | AxiosResponse<{ user: ResponseUserType; refreshToken: string }, any>
      | undefined = yield authApi.login(email, hashedPass);
    if (response?.status === ServerResponse.SUCSSES) {
      if (response.data) {
        const { _id, email } = response.data.user;
        commonStore.setItem("jwt-refresh", response.data.refreshToken);
        yield put(authActions.getUserAuthSucsses({ user: { id: _id, email } }));
        return;
      }
      yield put(authActions.getUserAuthSucsses(null));
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const massage = (error.response.data as { error: string }).error;
      yield put(authActions.getUserAuthFailed({ massage }));
    }
    console.log(error);
  }
}

export function* logout() {
  yield authApi.logout();
  yield commonStore.removeItem("jwt-refresh");
  yield put({ type: LOG_OUT.SUCSSES });
}

export default function* autSaga() {
  yield takeEvery(GET_USER.CALL, getUser);
  yield takeEvery(SIGN_UP.CALL, signUp);
  yield takeEvery(LOG_IN.CALL, login);
  yield takeEvery(LOG_OUT.CALL, logout);
}
