import { fork } from "redux-saga/effects";
import autSaga from "./authSaga";
import todoSaga from "./todoSaga";

export default function* rootSaga() {
  yield fork(todoSaga);
  yield fork(autSaga);
}
