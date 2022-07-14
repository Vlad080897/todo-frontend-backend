import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import todoReducer from '../reducers/todoReducer';
import userReducer from '../reducers/userReducer';
import rootSaga from '../sagas/rootSaga';

const SagaMiddleware = createSagaMiddleware();
const reducer = {
  todoReducer,
  userReducer
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SagaMiddleware),
  devTools: true
});

SagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<any>
>;
