import {
  GETTING_RESPONSE,
  GET_TASKS_FAILED,
  GET_TASKS_SUCSSES,
  DELETE_SUCSSES,
  ADD_SUCSSES,
  GET_ITEMS_LEFT,
  COMPLETE_TASK_SUCSSES,
  CLEAR_SUCSSES,
  CHECK_ALL_SUCSSES,
  TOGGLE_EDIT_MODE
} from './../actions/actionsNames';
import { ActionsType, TaskType } from './../types/todoTypes';

const initialState = {
  tasks: [] as TaskType[],
  itemsLeft: 0,
  loading: false,
  error: null as string | null
}
const todoReducer = (state: todoStateType = initialState, action: ActionsType) => {
  switch (action.type) {
    case GETTING_RESPONSE: {
      return {
        ...state,
        loading: true
      }
    }
    case GET_ITEMS_LEFT: {
      return {
        ...state,
        itemsLeft: state.tasks.filter(t => t.completed === false).length,
        loading: false
      }
    }
    case GET_TASKS_SUCSSES: {
      return {
        ...state,
        tasks: [...action.payload],
        loading: false,
        error: null


      }
    }
    case GET_TASKS_FAILED: {
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    }
    case DELETE_SUCSSES: {
      return {
        ...state,
        error: null,
        tasks: [...state.tasks.filter(t => t._id !== action.payload._id)],

      }
    }
    case ADD_SUCSSES: {
      return {
        ...state,
        error: null,
        tasks: [...state.tasks, action.payload]
      }
    }
    case COMPLETE_TASK_SUCSSES: {
      return {
        ...state,
        error: null,
        tasks: [...state.tasks.map(t => {
          if (t._id === action.id) {
            return {
              ...t,
              completed: !t.completed
            }
          }
          return t
        })]
      }
    }
    case CLEAR_SUCSSES: {
      return {
        ...state,
        error: null,
        tasks: [...action.newTasks]
      }
    }
    case CHECK_ALL_SUCSSES: {
      return {
        ...state,
        error: null,
        tasks: [...action.newTasks]
      }
    }
    case TOGGLE_EDIT_MODE: {
      return {
        ...state,
        error: null,
        loading: false,
        tasks: state.tasks.map(t => {
          if (t._id === action.id) {
            return {
              ...t,
              isEdit: !t.isEdit,
              description: action.description
            }
          }
          return t
        })
      }
    }

    default: return state
  }
}

export default todoReducer

export type todoStateType = typeof initialState;



