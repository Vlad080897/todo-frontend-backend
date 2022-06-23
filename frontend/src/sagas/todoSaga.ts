import axios, { AxiosResponse } from 'axios';
import { put, select, takeEvery } from "redux-saga/effects";
import { actions } from '../actions/actions';
import {
  ADD_NEW_TASK_CLICK, CHECK_ALL_CLICK,
  CLEAR_CLICK, COMPLETE_TASK_CLICK,
  DELETE_CLICK, GET_TASKS_CLICK, TOGGLE_CLICK,
  UPDATE_TASK
} from "../actions/actionsNames";
import { todoApi } from './../api/todoApi';
import { ServerResponse } from './../enums/todoEnums';
import { getTasksSelector } from './../selectors/todoSelectors';
import {
  AddNewTaskAction,
  completeTaskAction,
  DeleteTaskAction,
  TaskType,
  ToggleEditMode
} from './../types/todoTypes';

function* getTasks() {
  yield put(actions.getTasksRequest());
  try {
    const response: AxiosResponse<TaskType[], any> = yield todoApi.getTasks();
    if (response.status === ServerResponse.SUCSSES) {
      const newTasks = response.data;
      yield put(actions.getTasksSucsses({ newTasks }));
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const massage = err.message;
      yield put(actions.getTasksFailed({ massage }));
    }
  }
}

function* addNewTask(action: AddNewTaskAction) {
  yield put(actions.addTaskRequest());
  const { newTask } = action;
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.addNewTasks(newTask)
    if (response.status === ServerResponse.SUCSSES) {
      const newTaskBody = response.data
      yield put(actions.addTaskSucsses({ newTaskBody }));
    }
    if (response.status === ServerResponse.FAILED) {
      console.log(response);
    }

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const massage = (error.response.data as { err: string }).err
      yield put(actions.addTaskFailed({ massage }));
    }
  }
}

function* deleteTask(action: DeleteTaskAction) {
  yield put(actions.deleteTaskRequest());
  const { id } = action
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.deleteTask(id)
    if (response.status === ServerResponse.SUCSSES) {
      yield put(actions.deleteTaskSucsses({ id }));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const massage = error.message;
      yield put(actions.deleteTaskFailed({ massage }));
    }
  }
}

function* completeTask(action: completeTaskAction) {
  yield put(actions.completeTaskRequest());
  const { id, completed } = action
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.completeTask(id, !completed)
    if (response.status === ServerResponse.SUCSSES) {
      const id = response.data._id
      yield put(actions.completeTaskSucsses({ id }));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const massage = error.message;
      yield put(actions.completeTaskFailed({ massage }));
    }
  }
}

function* clearCompleted() {
  yield put(actions.clearTasksRequest());
  try {
    const response: AxiosResponse<any, any> = yield todoApi.clearCompleted();
    if (response.status === ServerResponse.SUCSSES) {
      const tasks: TaskType[] = yield select(getTasksSelector);
      const newTasks = tasks.filter(t => t.completed !== true)
      yield put(actions.clearTasksSucsses({ newTasks }))
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const massage = error.message;
      yield put(actions.clearTasksFailed({ massage }));
    }
  }
}

function* checkAll(btn: {
  type: string,
  checkAllBtn: React.RefObject<HTMLInputElement | null>
}) {
  const tasks: TaskType[] = yield select(getTasksSelector);
  const haveNotCompleted = tasks.find(t => t.completed === false);
  try {
    if (haveNotCompleted && tasks.length) {
      yield put(actions.checkAllRequest());
      const response: AxiosResponse<any, any> = yield todoApi.checkAll(true);
      if (response.status === ServerResponse.SUCSSES) {
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
      const response: AxiosResponse<any, any> = yield todoApi.checkAll(false);
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
    if (btn.checkAllBtn.current) {
      btn.checkAllBtn.current.checked = false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const massage = error.message;
      yield put(actions.checkAllFailed({ massage }));
    }
  }
}

function* toggleEditMode(action: ToggleEditMode) {
  yield put(actions.toggleRequest());
  const { id, description, isEdit } = action;
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.toggleEditMode(id, isEdit)
    if (response.status === ServerResponse.SUCSSES) {
      yield put(actions.toggleSucsses({ id, description }))
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const massage = error.message;
      yield put(actions.toggleFailed({ massage }));
    }
  }
}

function* updateTask(action: ToggleEditMode) {
  yield put(actions.toggleRequest());
  const { id, description, isEdit } = action
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.updateValue(id, isEdit, description)
    if (response.status === ServerResponse.SUCSSES) {
      yield put(actions.toggleSucsses({ id, description }))
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const massage = error.message;
      yield put(actions.toggleFailed({ massage }));
    }
  }
}

export default function* todoSaga() {
  yield takeEvery(GET_TASKS_CLICK, getTasks);
  yield takeEvery(ADD_NEW_TASK_CLICK, addNewTask);
  yield takeEvery(DELETE_CLICK, deleteTask);
  yield takeEvery(COMPLETE_TASK_CLICK, completeTask);
  yield takeEvery(CLEAR_CLICK, clearCompleted);
  yield takeEvery(CHECK_ALL_CLICK, checkAll);
  yield takeEvery(UPDATE_TASK, updateTask)
  yield takeEvery(TOGGLE_CLICK, toggleEditMode)
}



