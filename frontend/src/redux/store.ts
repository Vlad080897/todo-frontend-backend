import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import todoReducer from '../reducers/todoReducer';
import rootSaga from '../sagas/rootSaga';
import { ActionsType } from '../types/todoTypes';

const SagaMiddleware = createSagaMiddleware();
const reducer = {
  todoReducer
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
  ActionsType
>;
