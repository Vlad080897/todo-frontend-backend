import { authActions } from '../actions/authActions';
import { ActionType, getType } from 'typesafe-actions';
import { actions } from '../actions/todosActions';
import { TaskType } from '../types/todoTypes';

const initialState = {
  tasks: [] as TaskType[],
  itemsLeft: 0,
  loading: false,
  error: null as string | null
}


export const todoReducer = (state: todoStateType = initialState, action: ActionType<typeof actions> | ActionType<typeof authActions>) => {
  switch (action.type) {
    case getType(actions.getTasksRequest): {
      return {
        ...state,
        loading: true,
      }
    }
    case getType(actions.getTasksSucsses): {
      return {
        ...state,
        tasks: [...action.payload.newTasks],
        error: null,
        loading: false,
      }
    }
    case getType(actions.getTasksFailed): {
      return {
        ...state,
        loading: false,
        error: action.payload.massage,
      }
    }
    case getType(actions.addTaskRequest): {
      return {
        ...state,
        loading: true
      }
    }
    case getType(actions.addTaskSucsses): {
      return {
        ...state,
        tasks: [...state.tasks, action.payload.newTaskBody],
        loading: false,
        error: null,
      }
    }
    case getType(actions.addTaskFailed): {
      return {
        ...state,
        loading: false,
        error: action.payload.massage
      }
    }
    case getType(actions.deleteTaskRequest): {
      return {
        ...state,
        loading: true
      }
    }
    case getType(actions.deleteTaskSucsses): {
      return {
        ...state,
        tasks: [...state.tasks.filter(t => t._id !== action.payload.id)],
        loading: false,
        error: null,
      }
    }
    case getType(actions.deleteTaskFailed): {
      return {
        ...state,
        loading: false,
        error: action.payload.massage,
      }
    }
    case getType(actions.completeTaskRequest): {
      return {
        ...state,
        loading: true,
        error: null
      }
    }
    case getType(actions.completeTaskSucsses): {
      return {
        ...state,
        loading: false,
        error: null,
        tasks: [...state.tasks.map(t => {
          if (t._id === action.payload.id) {
            return {
              ...t,
              completed: !t.completed
            }
          }
          return t
        })]
      }
    }
    case getType(actions.completeTaskFailed): {
      return {
        ...state,
        loading: false,
        error: action.payload.massage
      }
    }
    case getType(actions.clearTasksRequest): {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case getType(actions.clearTasksSucsses): {
      
      return {
        ...state,
        error: null,
        loading: false,
        tasks: action.payload.newTasks
      }
    }
    case getType(actions.clearTasksFailed): {
      return {
        ...state,
        error: action.payload.massage,
        loading: false
      }
    }
    case getType(actions.checkAllRequest): {
      return {
        ...state,
        loading: true,
      }
    }
    case getType(actions.checkAllSucsses): {
      return {
        ...state,
        loading: false,
        error: null,
        tasks: [...action.payload.newTasks]
      }
    }
    case getType(actions.checkAllFailed): {
      return {
        ...state,
        loading: false,
        error: action.payload.massage,
      }
    }
    case getType(actions.toggleRequest): {
      return {
        ...state,
        loading: true,
      }
    }
    case getType(actions.toggleSucsses): {
      return {
        ...state,
        error: null,
        loading: false,
        tasks: state.tasks.map(t => {
          if (t._id === action.payload.id) {
            return {
              ...t,
              isEdit: !t.isEdit,
              description: action.payload.description
            }
          }
          return t
        })
      }
    }
    case getType(actions.toggleFailed): {
      return {
        ...state,
        loading: false,
        error: action.payload.massage
      }
    }
    case getType(authActions.logUserOut): {
      return {
        ...state,
        tasks: []
      }
    }

    default: return state
  }
}

export default todoReducer

export type todoStateType = typeof initialState;

