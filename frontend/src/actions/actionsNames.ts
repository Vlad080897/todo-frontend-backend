export const DELETE_CLICK = "DELETE_API";
export const ADD_NEW_TASK_CLICK = 'ADD_NEW_TASK_CLICK';
export const GET_ITEMS_LEFT = 'GET_ITEMS_LEFT';
export const COMPLETE_TASK_CLICK = 'COMPLETE_TASK_CLICK';
export const CLEAR_CLICK = 'CLEAR_CLICK';
export const CHECK_ALL_CLICK = 'CHECK_ALL_CLICK';
export const TOGGLE_CLICK = 'TOGGLE_CLICK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const GET_TASKS_CLICK = 'GET_TASKS_CLICK'


const actionsNameCreator = <T extends string>(name: T): {
  baseName: T,
  REQUEST: `${T}_REQUEST`,
  SUCSSES: `${T}_SUCSSES`,
  FAILED: `${T}_FAILED`
} => {
  return {
    baseName: name,
    REQUEST: `${name}_REQUEST`,
    SUCSSES: `${name}_SUCSSES`,
    FAILED: `${name}_FAILED`
  }
}
export const GET_TASKS = actionsNameCreator<'GET_TASKS'>('GET_TASKS');
export const ADD_TASK = actionsNameCreator('ADD_TASK');
export const DELETE_TASK = actionsNameCreator('DELETE_TASK');
export const COMPLETE_TASK = actionsNameCreator('COMPLETE_TASK');
export const CLEAR_TASKS = actionsNameCreator('CLEAR_TASKS');
export const CHECK_ALL = actionsNameCreator('CHECK_ALL');
export const TOGGLE = actionsNameCreator('TOGGLE');