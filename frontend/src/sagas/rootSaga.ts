import { all, call, ForkEffect, spawn } from "redux-saga/effects";
import todoSaga from "./todoSaga";

const sagas: (() => Generator<ForkEffect<never>, void, unknown>)[] = [todoSaga]

export default function* rootSaga() {
  yield all(sagas.map((saga) => {
    return spawn(function* () {
      while (true) {
        try {
          yield call(saga);
          break;
        } catch (error) {
          console.log(error);
        }
      }
    })
  }))
} 