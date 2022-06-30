import { createAction } from 'typesafe-actions';
import { GET_USER, LOG_OUT } from './actionsNames';

export const authActions = {
  getUserAuth: createAction(GET_USER.REQUEST)(),
  getUserAuthSucsses: createAction(GET_USER.SUCSSES)<{ user: { id: string, email: string } } | null>(),
  getUserAuthFailed: createAction(GET_USER.FAILED)<{ massage: string }>(),
  logUserOut: createAction(LOG_OUT.SUCSSES)(),
}