import { RootState } from './../redux/store';
import { select } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import { runSaga, stdChannel } from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';
import { put } from 'redux-saga/effects';
import { addNewTask, clearCompleted, completeTask, deleteTask, getTasks } from '../sagas/todoSaga';
import { ADD_TASK, CLEAR_TASKS, COMPLETE_TASK, DELETE_TASK, GET_TASKS, GET_USER } from './../actions/actionsNames';
import { actions } from './../actions/todosActions';
import { todoApi } from './../api/todoApi';
import { TaskType } from './../types/todoTypes';
import { getTasksSelector } from '../selectors/todoSelectors';

const allTasks = [
  {
    completed: false,
    createdAt: 'test',
    description: 'test',
    isEdit: false,
    updatedAt: 'test',
    __v: 0,
    _id: '1'
  },
  {
    completed: false,
    createdAt: 'test2',
    description: 'test2',
    isEdit: false,
    updatedAt: 'test2',
    __v: 0,
    _id: '2'
  }
];

const task = {
  completed: false,
  createdAt: 'test',
  description: 'test',
  isEdit: false,
  updatedAt: 'test',
  __v: 0,
  _id: 'test-userId-1'
}

const createAxiosError = (code: number, message: string) => {
  return {
    message: 'AxiosError',
    isAxiosError: true,
    config: {},
    toJSON: () => Object,
    name: 'AxiosError',
    response: {
      data: {
        error: message
      },
      status: code,
      statusText: '',
      headers: {},
      config: {}
    },
  }
}

const createAxiosResponse = <T, N extends string>(code: number, payload: T, name?: N) => {
  return {
    data: {
      [name as N]: payload
    },
    status: code,
    statusText: '',
    headers: {},
    config: {},
  }
}

describe('Todo-sagas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('get-tasks-saga', () => {
    const action = {
      type: GET_TASKS.CALL,
      userId: '1'
    }
    test('getTasks saga succses', () => {

      const response = createAxiosResponse<TaskType[], 'allTasks'>(200, allTasks, 'allTasks')
      todoApi.getTasks = jest.fn().mockResolvedValue(response);
      return expectSaga(getTasks, action)
        .put(actions.getTasksRequest())
        .put(actions.getTasksSucsses({ newTasks: response.data.allTasks }))
        .run();
    });

    test('getTasks saga failed', () => {
      const action = {
        type: GET_TASKS.CALL,
        userId: 'test-userId-1'
      }
      const error: AxiosError<{ error: string }, any> = createAxiosError(404, 'Get tasks failed')
      todoApi.getTasks = jest.fn().mockRejectedValue(error)
      return expectSaga(getTasks, action)
        .put(actions.getTasksRequest())
        .put(actions.getTasksFailed({ massage: 'Get tasks failed' }))
        .run();
    })

    test('get tasks failed with not authorized error', async () => {
      const error = createAxiosError(401, 'User not authorized');
      todoApi.getTasks = jest.fn().mockRejectedValue(error);

      const dispatched: errorDispatchedType = [];

      await runSaga({
        dispatch: (action: errorActionType) => dispatched.push(action)
      }, getTasks, action).toPromise();

      expect(todoApi.getTasks).toHaveBeenCalledTimes(1);
      expect(todoApi.getTasks).toHaveBeenCalledWith(action.userId);
      expect(dispatched).toEqual([
        {
          type: GET_TASKS.REQUEST
        },
        {
          type: GET_TASKS.FAILED,
          payload: {
            massage: "User not authorized"
          }
        }
      ])
    })
  })

  describe('add-task-saga', () => {

    const action = {
      type: ADD_TASK.CALL,
      newTask: task
    }
    test('add task sucsses', () => {
      const sucssesResponse = {
        data: task,
        status: 200,
        statusText: '',
        headers: {},
        config: {}
      };
      todoApi.addNewTasks = jest.fn().mockResolvedValue(sucssesResponse)
      const gen = addNewTask(action);
      expect(gen.next().value).toEqual(put(actions.addTaskRequest()));
      expect(gen.next().value).toEqual(todoApi.addNewTasks(task))
      expect(gen.next(sucssesResponse).value).toEqual(put(actions.addTaskSucsses({ newTaskBody: task })))
      expect(gen.next().done).toBeTruthy();
    })

    test('add task failed', async () => {
      const error: AxiosError = createAxiosError(403, 'add task failed');
      todoApi.addNewTasks = jest.fn().mockRejectedValue(error);
      const dispatched: {
        type: string,
        payload?: {
          massage: string
        }
      }[] = [];

      await runSaga({
        dispatch: (action: { type: string, payload?: { massage: string } }) => dispatched.push(action),
        getState: () => null
      }, addNewTask, action).toPromise();

      expect(todoApi.addNewTasks).toHaveBeenCalledWith(task);
      expect(todoApi.addNewTasks).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: ADD_TASK.REQUEST
        },
        {
          type: ADD_TASK.FAILED,
          payload: {
            massage: 'add task failed'
          }
        }
      ])
    })

    test('add task failed with not authorized error', async () => {
      const error = createAxiosError(401, 'User not autorized');
      todoApi.addNewTasks = jest.fn().mockRejectedValue(error);

      const dispatched: errorDispatchedType = [];

      await runSaga({
        dispatch: (action: errorActionType) => dispatched.push(action)
      }, addNewTask, action).toPromise();

      expect(todoApi.addNewTasks).toHaveBeenCalledWith(task);
      expect(todoApi.addNewTasks).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: ADD_TASK.REQUEST
        },
        {
          type: GET_USER.SUCSSES,
          payload: null
        }
      ])
    })

  })

  describe('delete-task-saga', () => {
    const action = {
      type: DELETE_TASK.CALL,
      id: 'test-userId-1'
    }
    test('delete task sucsses', () => {
      const response = {
        data: {
          deletedTask: task
        },
        status: 200,
        statusText: '',
        headers: {},
        config: {},
      }

      todoApi.deleteTask = jest.fn().mockResolvedValue(response);
      const gen = deleteTask(action);
      expect(gen.next().value).toEqual(put(actions.deleteTaskRequest()));
      expect(gen.next().value).toEqual(todoApi.deleteTask(task._id));
      expect(gen.next(response).value).toEqual(put(actions.deleteTaskSucsses({ id: task._id })));
      expect(gen.next().done).toBeTruthy();
    })

    test('delet task failed', async () => {
      const error = createAxiosError(404, 'delete task failed')
      todoApi.deleteTask = jest.fn().mockRejectedValue(error);
      const dispatched: {
        type: string,
        payload?: {
          massage: string
        }
      }[] = [];
      await runSaga({
        dispatch: (action: { type: string, payload?: { massage: string } }) => dispatched.push(action),
        getState: () => null
      }, deleteTask, action).toPromise()

      expect(todoApi.deleteTask).toHaveBeenCalledWith(task._id);
      expect(dispatched).toEqual([
        {
          type: DELETE_TASK.REQUEST
        },
        {
          type: DELETE_TASK.FAILED,
          payload: { massage: 'delete task failed' }
        }
      ])
    })

    test('delet task failed with not authorized error', async () => {
      const error = createAxiosError(401, 'User not authorized')
      todoApi.deleteTask = jest.fn().mockRejectedValue(error);
      const dispatched: errorDispatchedType = [];
      await runSaga({
        dispatch: (action: errorActionType) => dispatched.push(action)
      }, deleteTask, action).toPromise();

      expect(todoApi.deleteTask).toHaveBeenCalledWith(task._id);
      expect(todoApi.deleteTask).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: DELETE_TASK.REQUEST,
        },
        {
          type: GET_USER.SUCSSES,
          payload: null
        }
      ])

    })
  })

  describe('complete-task-saga', () => {
    let dispatched: {
      type: string,
      payload?: {
        id: string
      }
    }[] = [];

    beforeEach(() => {
      dispatched = [];
    })

    const action = {
      type: COMPLETE_TASK.CALL,
      completed: false,
      id: 'test-userId-1',
    }

    test('comlete-task-sucsses', async () => {
      const response = {
        data: task,
        status: 200,
        statusText: '',
        headers: {},
        config: {},
      };
      todoApi.completeTask = jest.fn().mockResolvedValue(response);

      await runSaga({
        dispatch: (action: { type: string, payload?: { id: string } }) => dispatched.push(action)
      }, completeTask, action).toPromise()

      expect(todoApi.completeTask).toHaveBeenCalledWith(action.id, !action.completed);
      expect(todoApi.completeTask).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: COMPLETE_TASK.REQUEST
        },
        {
          type: COMPLETE_TASK.SUCSSES,
          payload: {
            id: "test-userId-1",
          }
        }
      ])
    })

    test('complete-task-failed', async () => {
      const error = createAxiosError(404, 'No such task');
      todoApi.completeTask = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: { type: string, payload?: { id: string } }) => dispatched.push(action)
      }, completeTask, action).toPromise()

      expect(todoApi.completeTask).toHaveBeenCalledWith(action.id, !action.completed);
      expect(todoApi.completeTask).toHaveBeenCalledTimes(1);

      expect(dispatched).toEqual([
        {
          type: COMPLETE_TASK.REQUEST
        },
        {
          type: COMPLETE_TASK.FAILED,
          payload: {
            massage: "No such task"
          }
        }
      ])

    })

    test('complete-task-failed with 401', async () => {
      const error = createAxiosError(401, 'User not authorized');
      todoApi.completeTask = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: { type: string, payload?: { id: string } }) => dispatched.push(action)
      }, completeTask, action).toPromise();

      expect(todoApi.completeTask).toHaveBeenCalledTimes(1);
      expect(todoApi.completeTask).toHaveBeenCalledWith(action.id, !action.completed);

      expect(dispatched).toEqual([
        {
          type: COMPLETE_TASK.REQUEST
        },
        {
          type: GET_USER.SUCSSES,
          payload: null
        },
      ])


    })

  })

  describe('clear-completed-tasks-saga', () => {
    const action = {
      type: CLEAR_TASKS.CALL
    }

    const dispatched: {
      type: string,
      payload?: TaskType[]
    }[] = []
    test('clear-completed-success', async () => {

      const response2 = {
        data: 'Completed tasks deleted',
        status: 200,
        statusText: '',
        headers: {},
        config: {},
      }

      const channel = stdChannel()

      todoApi.clearCompleted = jest.fn().mockResolvedValue(response2);
      const state = { newTasks: allTasks }

      await runSaga({
        channel,
        dispatch: (action: { type: string, payload?: TaskType[] }) => dispatched.push(action),
        getState: () => 'asfasfasf'
      },
        //@ts-ignore 
        clearCompleted, action).toPromise()

      expect(todoApi.clearCompleted).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: CLEAR_TASKS.REQUEST
        },

      ])

    })
  })
})

type errorDispatchedType = {
  type: string,
  payload?: {
    massage: string
  }
}[]

type errorActionType = { type: string, payload?: { massage: string } }