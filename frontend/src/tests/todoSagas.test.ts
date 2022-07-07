import { AxiosError } from 'axios';
import { runSaga } from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';
import { put } from 'redux-saga/effects';
import { ADD_TASK, COMPLETE_TASK, DELETE_TASK, GET_TASKS, GET_USER, TOGGLE, UPDATE } from '../actions/actionsNames';
import { actions } from '../actions/todosActions';
import { todoApi } from '../api/todoApi';
import { addNewTask, checkAll, clearCompleted, completeTask, deleteTask, getTasks, toggleEditMode, updateTask } from '../sagas/todoSaga';
import { TaskType } from '../types/todoTypes';
import { CHECK_ALL, CLEAR_TASKS } from './../actions/actionsNames';

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
    completed: true,
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
    data: payload,
    status: code,
    statusText: '',
    headers: {},
    config: {},
  }
}

describe('Todo-sagas', () => {

  describe('get-tasks-saga', () => {
    const action = {
      type: GET_TASKS.CALL,
      userId: '1'
    }
    test('getTasks saga succses', () => {
      const response = createAxiosResponse<{ allTasks: TaskType[] }, 'allTasks'>(200, { allTasks }, 'allTasks')
      todoApi.getTasks = jest.fn().mockResolvedValue(response);

      return expectSaga(getTasks, action)
        .put(actions.getTasksRequest())
        .put(actions.getTasksSucsses({ newTasks: response.data.allTasks }))
        .run();
    });

    test('getTasks saga failed', () => {
      const error: AxiosError<{ error: string }, any> = createAxiosError(404, 'Get tasks failed')
      todoApi.getTasks = jest.fn().mockRejectedValue(error)

      return expectSaga(getTasks, action)
        .put(actions.getTasksRequest())
        .put(actions.getTasksFailed({ massage: 'Get tasks failed' }))
        .run();
    })

    test('get tasks failed with not authorized error 401/403', async () => {
      const error = createAxiosError(401, 'User not authorized');
      todoApi.getTasks = jest.fn().mockRejectedValue(error);

      const dispatched: actionType[] = [];

      type actionType = {
        type: string,
        payload?: {
          massage: string
        }
      }

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
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

    let dispatched: actionType[] = [];

    type actionType = {
      type: string,
      payload?: {
        massage: string
      }
    }

    beforeEach(() => {
      dispatched = []
    })
    test('add task sucsses', () => {
      const response = createAxiosResponse(200, task)
      todoApi.addNewTasks = jest.fn().mockResolvedValue(response)

      const gen = addNewTask(action);
      expect(gen.next().value).toEqual(put(actions.addTaskRequest()));
      expect(gen.next().value).toEqual(todoApi.addNewTasks(task))
      expect(gen.next(response).value).toEqual(put(actions.addTaskSucsses({ newTaskBody: task })))
      expect(gen.next().done).toBeTruthy();
    })

    test('add task failed 401/403', async () => {
      const error: AxiosError = createAxiosError(401, 'add task failed');
      todoApi.addNewTasks = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
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

    test('add task failed 404', async () => {
      const error: AxiosError = createAxiosError(404, 'add task failed');
      todoApi.addNewTasks = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
      }, addNewTask, action).toPromise();

      expect(dispatched).toEqual([
        {
          type: ADD_TASK.REQUEST
        },
        {
          type: ADD_TASK.FAILED,
          payload: {
            massage: "add task failed",
          }
        }
      ])
    })

  })

  describe('delete-task-saga', () => {
    const action = {
      type: DELETE_TASK.CALL,
      id: 'test-userId-1'
    }

    let dispatched: actionType[] = [];

    type actionType = {
      type: string,
      payload?: {
        massage: string
      } | { id: string }
    }

    beforeEach(() => {
      dispatched = []
    })
    test('delete task sucsses', () => {
      const response = createAxiosResponse(200, { deletedTask: task })
      todoApi.deleteTask = jest.fn().mockResolvedValue(response);

      const gen = deleteTask(action);
      expect(gen.next().value).toEqual(put(actions.deleteTaskRequest()));
      expect(gen.next().value).toEqual(todoApi.deleteTask(task._id));
      expect(gen.next(response).value).toEqual(put(actions.deleteTaskSucsses({ id: task._id })));
      expect(gen.next().done).toBeTruthy();
    })

    test('delet task failed 404', async () => {
      const error = createAxiosError(404, 'delete task failed')
      todoApi.deleteTask = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
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

    test('delet task failed with not authorized error 401/403', async () => {
      const error = createAxiosError(401, 'User not authorized')
      todoApi.deleteTask = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
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
    let dispatched: actionType[] = [];

    beforeEach(() => {
      dispatched = [];
    })

    type actionType = {
      type: string,
      payload?: {
        id: string
      }
    }

    const action = {
      type: COMPLETE_TASK.CALL,
      completed: false,
      id: 'test-userId-1',
    }

    test('comlete-task-sucsses', async () => {
      const response = createAxiosResponse(200, task)
      todoApi.completeTask = jest.fn().mockResolvedValue(response);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
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

    test('complete-task-failed with 401/403', async () => {
      const error = createAxiosError(403, 'User not authorized');
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

    let dispatched: actionType[] = [];

    beforeEach(() => {
      dispatched = []
    })

    type actionType = {
      type: string,
      payload?: { newTasks: TaskType[] } | { massage: string }
    }

    test('clear-success', async () => {
      const response = createAxiosResponse(200, 'Chosen tasks successfully deleted');
      todoApi.clearCompleted = jest.fn().mockResolvedValue(response);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
        getState: () => ({ todoReducer: { tasks: allTasks } })
      },
        //@ts-ignore
        clearCompleted).toPromise()

      expect(todoApi.clearCompleted).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: CLEAR_TASKS.REQUEST
        },
        {
          type: CLEAR_TASKS.SUCSSES,
          payload: {
            newTasks: [{
              "__v": 0,
              "_id": "1",
              "completed": false,
              "createdAt": "test",
              "description": "test",
              "isEdit": false,
              "updatedAt": "test",
            }]
          }
        }
      ])


    })

    test('clear-tasks-failed-401/403', async () => {
      const error = createAxiosError(403, 'User is not authorized');
      todoApi.clearCompleted = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      },
        //@ts-ignore
        clearCompleted).toPromise()

      expect(dispatched).toEqual([
        { type: CLEAR_TASKS.REQUEST },
        {
          type: GET_USER.SUCSSES,
          payload: null
        }
      ])

    })
    test('clear-tasks-failed-404', async () => {
      const error = createAxiosError(404, 'Something went wrong');
      todoApi.clearCompleted = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      },
        //@ts-ignore
        clearCompleted).toPromise()


      expect(dispatched).toEqual([
        { type: CLEAR_TASKS.REQUEST },
        {
          type: CLEAR_TASKS.FAILED,
          payload: {
            massage: 'Something went wrong'
          }
        }
      ])
    })


  })

  describe('check-all-saga', () => {

    const action = {
      type: CHECK_ALL.CALL,
      checkAllBtn: document.createElement('input') as unknown as React.RefObject<HTMLInputElement | null>
    }

    let dispatched: actionType[] = []

    beforeEach(() => {
      dispatched = []
    })

    type actionType = {
      type: string,
      payload?: { newTasks: TaskType[] } | { massage: string }
    }

    test('check-all-success', async () => {

      const response = createAxiosResponse(200, allTasks)
      todoApi.checkAll = jest.fn().mockResolvedValue(response)

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
        getState: () => ({ todoReducer: { tasks: allTasks } })
      },
        //@ts-ignore
        checkAll, action).toPromise()

      expect(todoApi.checkAll).toHaveBeenCalledTimes(1);
      expect(todoApi.checkAll).toHaveBeenCalledWith(true);
      expect(dispatched).toEqual([
        {
          type: CHECK_ALL.REQUEST
        },
        {
          type: CHECK_ALL.SUCSSES,
          payload: {
            newTasks: [
              {
                completed: true,
                createdAt: 'test',
                description: 'test',
                isEdit: false,
                updatedAt: 'test',
                __v: 0,
                _id: '1'
              },
              {
                completed: true,
                createdAt: 'test2',
                description: 'test2',
                isEdit: false,
                updatedAt: 'test2',
                __v: 0,
                _id: '2'
              }
            ]
          }
        }
      ])


    })

    test('check-all-filed-401/403', async () => {
      const error = createAxiosError(403, 'User is not authorized')
      todoApi.checkAll = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
        getState: () => ({ todoReducer: { tasks: allTasks } })
      },
        //@ts-ignore
        checkAll, action).toPromise()

      expect(dispatched).toEqual([
        {
          type: CHECK_ALL.REQUEST
        },
        {
          type: GET_USER.SUCSSES,
          payload: null
        }
      ])

    })

    test('check-all-failed-404', async () => {
      const error = createAxiosError(404, 'Something went wrong');
      todoApi.checkAll = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
        getState: () => ({ todoReducer: { tasks: allTasks } })
      },
        //@ts-ignore
        checkAll, action).toPromise()

      expect(dispatched).toEqual([
        {
          type: CHECK_ALL.REQUEST
        },
        {
          type: CHECK_ALL.FAILED,
          payload: {
            massage: 'Something went wrong'
          }
        }
      ])
    })
  })

  describe('toggle-edit-mode-saga', () => {
    const action = {
      type: TOGGLE.CALL,
      id: 'user-test-id-1',
      description: 'test-description',
      isEdit: false
    }

    let dispatched: actionType[] = []

    beforeEach(() => {
      dispatched = []
    })

    type actionType = {
      type: string,
      payload?: { id: string, description: string }
    }


    test('toggle-edit-mode-success', async () => {
      const response = createAxiosResponse(200, task);
      todoApi.toggleEditMode = jest.fn().mockResolvedValue(response);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      }, toggleEditMode, action).toPromise()

      expect(todoApi.toggleEditMode).toHaveBeenCalledTimes(1);
      expect(todoApi.toggleEditMode).toHaveBeenCalledWith(action.id, action.isEdit);
      expect(dispatched).toEqual([
        {
          type: TOGGLE.REQUEST
        },
        {
          type: TOGGLE.SUCSSES,
          payload: { id: action.id, description: action.description }
        }
      ])

    })

    test('toggle-edit-mode-401/403', async () => {
      const error = createAxiosError(403, 'User is not authorized')
      todoApi.toggleEditMode = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: {
          type: string,
          payload?: { id: string, description: string }
        }) => dispatched.push(action)
      }, toggleEditMode, action).toPromise()

      expect(todoApi.toggleEditMode).toHaveBeenCalledTimes(1);
      expect(todoApi.toggleEditMode).toHaveBeenCalledWith(action.id, action.isEdit);
      expect(dispatched).toEqual([
        { type: TOGGLE.REQUEST },
        {
          type: GET_USER.SUCSSES,
          payload: null
        }
      ])
    })

    test('toggle-edit-mode-404', async () => {
      const error = createAxiosError(404, 'Task is not found');
      todoApi.toggleEditMode = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: {
          type: string,
          payload?: { id: string, description: string }
        }) => dispatched.push(action)
      }, toggleEditMode, action).toPromise()


      expect(dispatched).toEqual([
        {
          type: TOGGLE.REQUEST
        },
        {
          type: TOGGLE.FAILED,
          payload: { massage: 'Task is not found' }
        }
      ])

    })
  })

  describe('update-value-saga', () => {
    const action = {
      type: UPDATE.CALL,
      id: 'user-test-id-1',
      description: 'test-description',
      isEdit: false
    }

    let dispatched: actionType[] = []

    beforeEach(() => {
      dispatched = []
    })

    type actionType = {
      type: string,
      payload?: { id: string, description: string }
    }

    test('update-success', async () => {
      const response = createAxiosResponse(200, task)
      todoApi.updateValue = jest.fn().mockResolvedValue(response)

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      }, updateTask, action).toPromise()

      expect(todoApi.updateValue).toHaveBeenCalledTimes(1);
      expect(todoApi.updateValue).toHaveBeenCalledWith(action.id, action.isEdit, action.description);
      expect(dispatched).toEqual([
        {
          type: TOGGLE.REQUEST
        },
        {
          type: TOGGLE.SUCSSES,
          payload: {
            description: action.description,
            id: action.id
          }
        }

      ])
    })
    test('update-failed-401', async () => {
      const error = createAxiosError(401, 'User not authorized');
      todoApi.updateValue = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      }, updateTask, action).toPromise();

      expect(dispatched).toEqual([
        {
          type: TOGGLE.REQUEST
        },
        {
          type: GET_USER.SUCSSES,
          payload: null
        }
      ])

    })
    test('update-failed-404', async () => {
      const error = createAxiosError(404, 'No such task');
      todoApi.updateValue = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      }, updateTask, action).toPromise()

      expect(dispatched).toEqual([
        {
          type: TOGGLE.REQUEST
        },
        {
          type: TOGGLE.FAILED,
          payload: { massage: "No such task" }
        }
      ])
    })
  })
})
