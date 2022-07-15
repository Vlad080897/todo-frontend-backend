const actionsNameCreator = <T extends string>(name: T): {
  baseName: T,
  CALL: `${T}_CALL`
  REQUEST: `${T}_REQUEST`,
  SUCSSES: `${T}_SUCSSES`,
  FAILED: `${T}_FAILED`
} => {
  return {
    baseName: name,
    CALL: `${name}_CALL`,
    REQUEST: `${name}_REQUEST`,
    SUCSSES: `${name}_SUCSSES`,
    FAILED: `${name}_FAILED`
  }
}
export const GET_TASKS = actionsNameCreator('GET_TASKS');
export const ADD_TASK = actionsNameCreator('ADD_TASK');
export const DELETE_TASK = actionsNameCreator('DELETE_TASK');
export const COMPLETE_TASK = actionsNameCreator('COMPLETE_TASK');
export const CLEAR_TASKS = actionsNameCreator('CLEAR_TASKS');
export const CHECK_ALL = actionsNameCreator('CHECK_ALL');
export const TOGGLE = actionsNameCreator('TOGGLE');
export const GET_USER = actionsNameCreator('GET_USER');
export const SIGN_UP = actionsNameCreator('SIGN_UP');
export const LOG_IN = actionsNameCreator('LOG_IN');
export const LOG_OUT = actionsNameCreator('LOG_OUT');
export const UPDATE = actionsNameCreator('UPDATE');
