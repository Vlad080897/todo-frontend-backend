import axios, { AxiosResponse } from 'axios';
import { put, select, takeEvery } from "redux-saga/effects";
import {
  ADD_TASK,
  CHECK_ALL, COMPLETE_TASK, DELETE_TASK, GET_TASKS, TOGGLE, UPDATE
} from "../actions/actionsNames";
import { authActions } from '../actions/authActions';
import { actions } from '../actions/todosActions';
import { CLEAR_TASKS } from '../actions/actionsNames';
import { todoApi } from '../api/todoApi';
import { ServerResponse } from '../enums/todoEnums';
import { getTasksSelector } from '../selectors/todoSelectors';
import {
  AddNewTaskAction,
  completeTaskAction,
  DeleteTaskAction,
  TaskType,
  ToggleEditMode
} from '../types/todoTypes';

export function* getTasks(action: getTasksActionType) {
  yield put(actions.getTasksRequest());
  try {
    const response: (AxiosResponse<({ allTasks: TaskType[] }), any> | undefined) = yield todoApi.getTasks(action.userId);
    if (response?.status === ServerResponse.SUCSSES) {
      const { allTasks } = response.data;
      yield put(actions.getTasksSucsses({ newTasks: allTasks }));
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const massage = (err.response?.data as { error: string }).error;
      yield put(actions.getTasksFailed({ massage }));
    }
  }
}

export function* addNewTask(action: AddNewTaskAction) {
  yield put(actions.addTaskRequest());
  const { newTask } = action;
  try {
    const response: (AxiosResponse<TaskType, any> | undefined) = yield todoApi.addNewTasks(newTask)
    if (response?.status === ServerResponse.SUCSSES) {
      const newTaskBody = response.data
      yield put(actions.addTaskSucsses({ newTaskBody }));
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const notAuth = error.response.status === (ServerResponse.NOT_AUTH) || error.response.status === (ServerResponse.INCORRECT_TOKEN)
      if (notAuth) {
        yield put(authActions.getUserAuthSucsses(null));
        return;
      }
      const massage = (error.response.data as { error: string }).error
      yield put(actions.addTaskFailed({ massage }));
    }
  }
}

export function* deleteTask(action: DeleteTaskAction) {
  yield put(actions.deleteTaskRequest());
  const { id } = action
  try {
    const response: (AxiosResponse<{ deletedTask: TaskType }, any> | undefined) = yield todoApi.deleteTask(id)
    if (response?.status === ServerResponse.SUCSSES) {
      yield put(actions.deleteTaskSucsses({ id }));
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const notAuth = error.response.status === (ServerResponse.NOT_AUTH) || error.response.status === (ServerResponse.INCORRECT_TOKEN)
      if (notAuth) {
        yield put(authActions.getUserAuthSucsses(null));
        return;
      }
      const massage = (error.response.data as { error: string }).error
      yield put(actions.deleteTaskFailed({ massage }));
    }
  }
}

export function* completeTask(action: completeTaskAction) {
  yield put(actions.completeTaskRequest());
  const { id, completed } = action
  try {
    const response: (AxiosResponse<TaskType, any> | undefined) = yield todoApi.completeTask(id, !completed)
    if (response?.status === ServerResponse.SUCSSES) {
      const id = response.data._id

      //@ts-ignore
      yield put(actions.completeTaskSucsses({ id }));
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const notAuth = error.response.status === (ServerResponse.NOT_AUTH) || error.response.status === (ServerResponse.INCORRECT_TOKEN)
      if (notAuth) {
        yield put(authActions.getUserAuthSucsses(null));
        return;
      }
      const massage = (error.response.data as { error: string }).error
      yield put(actions.completeTaskFailed({ massage }));
    }
  }
}

export function* clearCompleted(action: clearComplAction) {
  yield put(actions.clearTasksRequest());
  try {
    const response: (AxiosResponse<string | any> | undefined) = yield todoApi.clearCompleted(action.userId);
    if (response?.status === ServerResponse.SUCSSES) {
      const tasks: TaskType[] = yield select(getTasksSelector);
      const newTasks = tasks.filter(t => t.completed !== true);
      yield put(actions.clearTasksSucsses({ newTasks: newTasks }))
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const notAuth = error.response.status === (ServerResponse.NOT_AUTH) || error.response.status === (ServerResponse.INCORRECT_TOKEN)
      if (notAuth) {
        yield put(authActions.getUserAuthSucsses(null));
        return
      }
      const massage = (error.response.data as { error: string }).error
      yield put(actions.clearTasksFailed({ massage }));
    }
  }
}

export function* checkAll(action: {
  type: string,
  checkAllBtn: React.RefObject<HTMLInputElement | null>,
  userId: string
}) {
  const tasks: TaskType[] = yield select(getTasksSelector);
  const haveNotCompleted = tasks.find(t => t.completed === false);
  try {
    if (haveNotCompleted && tasks.length) {
      yield put(actions.checkAllRequest());
      const response: (AxiosResponse<any, any> | undefined) = yield todoApi.checkAll(true, action.userId);
      if (response?.status === ServerResponse.SUCSSES) {
        const newTasks = tasks.map(t => {
          return {
            ...t,
            completed: true
          }
        });
        yield put(actions.checkAllSucsses({ newTasks }));
      }
    }
    if (!haveNotCompleted && tasks.length) {
      yield put(actions.checkAllRequest());
      const response: AxiosResponse<any, any> = yield todoApi.checkAll(false, action.userId);
      if (response.status === ServerResponse.SUCSSES) {
        const newTasks = tasks.map(t => {
          return {
            ...t,
            completed: false
          }
        });
        yield put(actions.checkAllSucsses({ newTasks }));
      }
    }
    if (action.checkAllBtn.current) {
      action.checkAllBtn.current.checked = false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const notAuth = error.response.status === (ServerResponse.NOT_AUTH) || error.response.status === (ServerResponse.INCORRECT_TOKEN)
      if (notAuth) {
        yield put(authActions.getUserAuthSucsses(null));
        return;
      }
      const massage = (error.response.data as { error: string }).error
      yield put(actions.checkAllFailed({ massage }));
    }
  }
}

export function* toggleEditMode(action: ToggleEditMode) {
  yield put(actions.toggleRequest());
  const { id, description, isEdit } = action;
  try {
    const response: (AxiosResponse<TaskType, any> | undefined) = yield todoApi.toggleEditMode(id, isEdit)
    if (response?.status === ServerResponse.SUCSSES) {
      yield put(actions.toggleSucsses({ id, description }))
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const notAuth = error.response.status === (ServerResponse.NOT_AUTH) || error.response.status === (ServerResponse.INCORRECT_TOKEN)
      if (notAuth) {
        yield put(authActions.getUserAuthSucsses(null));
        return;
      }
      const massage = (error.response.data as { error: string }).error
      yield put(actions.toggleFailed({ massage }));
    }
  }
}

export function* updateTask(action: ToggleEditMode) {
  yield put(actions.toggleRequest());
  const { id, description, isEdit } = action;
  try {
    const response: AxiosResponse<TaskType, any> | undefined = yield todoApi.updateValue(id, isEdit, description)
    if (response?.status === ServerResponse.SUCSSES) {
      yield put(actions.toggleSucsses({ id, description }))
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const notAuth = error.response.status === (ServerResponse.NOT_AUTH) || error.response.status === (ServerResponse.INCORRECT_TOKEN)
      if (notAuth) {
        yield put(authActions.getUserAuthSucsses(null));
        return
      }
      const massage = (error.response.data as { error: string }).error
      yield put(actions.toggleFailed({ massage }));
    }
  }
}

export default function* todoSaga() {
  yield takeEvery(GET_TASKS.CALL, getTasks);
  yield takeEvery(ADD_TASK.CALL, addNewTask);
  yield takeEvery(DELETE_TASK.CALL, deleteTask);
  yield takeEvery(COMPLETE_TASK.CALL, completeTask);
  yield takeEvery(CLEAR_TASKS.CALL, clearCompleted);
  yield takeEvery(CHECK_ALL.CALL, checkAll);
  yield takeEvery(UPDATE.CALL, updateTask)
  yield takeEvery(TOGGLE.CALL, toggleEditMode)
}

export type getTasksActionType = {
  type: string,
  userId: string
}

export type clearComplAction = {
  type: string,
  userId: string
}



