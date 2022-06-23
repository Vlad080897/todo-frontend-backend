import { GET_TASKS, ADD_TASK, DELETE_TASK, COMPLETE_TASK, CLEAR_TASKS, CHECK_ALL, TOGGLE } from './actionsNames';
import { TaskType } from './../types/todoTypes';
import { createAction } from 'typesafe-actions';

export const actions = {
  getTasksRequest: createAction(GET_TASKS.REQUEST)(),
  getTasksSucsses: createAction(GET_TASKS.SUCSSES)<{ newTasks: TaskType[] }>(),
  getTasksFailed: createAction(GET_TASKS.FAILED)<{ massage: string }>(),

  addTaskRequest: createAction(ADD_TASK.REQUEST)(),
  addTaskSucsses: createAction(ADD_TASK.SUCSSES)<{ newTaskBody: TaskType }>(),
  addTaskFailed: createAction(ADD_TASK.FAILED)<{ massage: string }>(),

  deleteTaskRequest: createAction(DELETE_TASK.REQUEST)(),
  deleteTaskSucsses: createAction(DELETE_TASK.SUCSSES)<{ id: string }>(),
  deleteTaskFailed: createAction(DELETE_TASK.FAILED)<{ massage: string }>(),

  completeTaskRequest: createAction(COMPLETE_TASK.REQUEST)(),
  completeTaskSucsses: createAction(COMPLETE_TASK.SUCSSES)<{ id: string }>(),
  completeTaskFailed: createAction(COMPLETE_TASK.FAILED)<{ massage: string }>(),

  clearTasksRequest: createAction(CLEAR_TASKS.REQUEST)(),
  clearTasksSucsses: createAction(CLEAR_TASKS.SUCSSES)<{ newTasks: TaskType[] }>(),
  clearTasksFailed: createAction(CLEAR_TASKS.FAILED)<{ massage: string }>(),

  checkAllRequest: createAction(CHECK_ALL.REQUEST)(),
  checkAllSucsses: createAction(CHECK_ALL.SUCSSES)<{ newTasks: TaskType[] }>(),
  checkAllFailed: createAction(CHECK_ALL.FAILED)<{ massage: string }>(),

  toggleRequest: createAction(TOGGLE.REQUEST)(),
  toggleSucsses: createAction(TOGGLE.SUCSSES)<{ id: string, description: string }>(),
  toggleFailed: createAction(TOGGLE.FAILED)<{ massage: string }>()

}



