import axios, { AxiosResponse } from 'axios';
import { put, select, takeEvery } from "redux-saga/effects";
import { todoApi } from './../api/todoApi';
import { ServerResponse } from './../enums/todoEnums';
import { getTasksSelector } from './../selectors/todoSelectors';
import { actions } from '../actions/actions';
import {
  AddNewTaskAction,
  completeTaskAction,
  DeleteTaskAction,
  TaskType,
  ToggleEditMode
} from './../types/todoTypes';
import {
  ADD_NEW_TASK_CLICK,
  COMPLETE_TASK_CLICK,
  DELETE_CLICK,
  GET_TASKS,
  CHECK_ALL_CLICK,
  CLEAR_CLICK,
  TOGGLE_CLICK,
  UPDATE_TASK,
} from "../actions/actionsNames";


function* getTasks() {
  yield put(actions.gettingResponse());
  try {
    const response: AxiosResponse<TaskType[], any> = yield todoApi.getTasks();
    if (response.status === ServerResponse.SUCSSES) {
      const data = response.data;
      yield put(actions.getTasksSucsses(data));
      yield put(actions.getItemsLeft());
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const massage = err.message;
      yield put(actions.getTasksFailed(massage));
    }
  }
}

function* addNewTask(action: AddNewTaskAction) {
  yield put(actions.gettingResponse());
  const { newTask } = action
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.addNewTasks(newTask)
    if (response.status === ServerResponse.SUCSSES) {
      const data = response.data
      yield put(actions.addNewTasks(data));
      yield put(actions.getItemsLeft());
    }

  } catch (error) {
    console.error(error);
  }
}

function* deleteTask(action: DeleteTaskAction) {
  yield put(actions.gettingResponse());
  const { id } = action
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.deleteTask(id)
    yield put(actions.deleteTask(response.data));
    yield put(actions.getItemsLeft());

  } catch (error) {
    console.error(error);
  }
}

function* completeTask(action: completeTaskAction) {
  yield put(actions.gettingResponse());
  const { id, completed } = action
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.completeTask(id, !completed)
    if (response.status === ServerResponse.SUCSSES) {
      const id = response.data._id
      yield put(actions.completeTask(id));
      yield put(actions.getItemsLeft());
    }
  } catch (error) {
    console.error(error);
  }
}

function* clearCompleted() {
  yield put(actions.gettingResponse());
  try {
    const response: AxiosResponse<any, any> = yield todoApi.clearCompleted();
    if (response.status === ServerResponse.SUCSSES) {
      const tasks: TaskType[] = yield select(getTasksSelector);
      const newTasks = tasks.filter(t => t.completed !== true)
      yield put(actions.clearCompleted(newTasks))
      yield put(actions.getItemsLeft());
    }

  } catch (error) {
    console.error(error);
  }
}

function* checkAll() {
  yield put(actions.gettingResponse());
  const tasks: TaskType[] = yield select(getTasksSelector);
  const haveNotCompleted = tasks.find(t => t.completed === false);
  try {
    if (haveNotCompleted) {
      const response: AxiosResponse<any, any> = yield todoApi.checkAll(true);
      if (response.status === ServerResponse.SUCSSES) {
        const newTask = tasks.map(t => {
          return {
            ...t,
            completed: true
          }
        });
        yield put(actions.checkAll(newTask));
      }
    }
    if (!haveNotCompleted) {
      const response: AxiosResponse<any, any> = yield todoApi.checkAll(false);
      if (response.status === ServerResponse.SUCSSES) {
        const newTask = tasks.map(t => {
          return {
            ...t,
            completed: false
          }
        });
        yield put(actions.checkAll(newTask));
      }
    }
    yield put(actions.getItemsLeft());
  } catch (error) {
    console.error(error);
  }

}

function* toggleEditMode(action: ToggleEditMode) {
  yield put(actions.gettingResponse());
  const { id, description, isEdit } = action;
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.toggleEditMode(id, isEdit)
    if (response.status === ServerResponse.SUCSSES) {
      yield put(actions.toggleEditMode(id, description))
    }
  } catch (error) {
    console.error(error);

  }
}

function* updateTask(action: ToggleEditMode) {
  yield put(actions.gettingResponse());
  const { id, description, isEdit } = action
  try {
    const response: AxiosResponse<TaskType, any> = yield todoApi.updateValue(id, isEdit, description)
    if (response.status === ServerResponse.SUCSSES) {
      yield put(actions.toggleEditMode(id, description))
    }
  } catch (error) {
    console.error(error);
  }
}

export default function* todoSaga() {
  yield takeEvery(GET_TASKS, getTasks);
  yield takeEvery(DELETE_CLICK, deleteTask);
  yield takeEvery(ADD_NEW_TASK_CLICK, addNewTask);
  yield takeEvery(COMPLETE_TASK_CLICK, completeTask);
  yield takeEvery(CLEAR_CLICK, clearCompleted);
  yield takeEvery(CHECK_ALL_CLICK, checkAll);
  yield takeEvery(UPDATE_TASK, updateTask)
  yield takeEvery(TOGGLE_CLICK, toggleEditMode)
}



