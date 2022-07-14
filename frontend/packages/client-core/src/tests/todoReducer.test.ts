import { authActions } from './../actions/authActions';
import { DELETE_TASK, COMPLETE_TASK, CLEAR_TASKS, CHECK_ALL, TOGGLE, LOG_OUT } from './../actions/actionsNames';
import { actions } from './../actions/todosActions';
import todoReducer, { todoStateType } from "../reducers/todoReducer";
import { TaskType } from "../types/todoTypes";
import { ADD_TASK, GET_TASKS } from '../actions/actionsNames';

const state = {
  tasks: [] as TaskType[],
  itemsLeft: 0,
  loading: false,
  error: null as string | null
}

const newTask = {
  _id: "62bd67465d5729197ab673364e",
  description: "test5",
  completed: false,
  isEdit: false,
  userId: "62bd59b1e1828144fe562fb6",
  createdAt: "2022-06-30T09:05:10.242Z",
  updatedAt: "2022-06-30T09:05:10.242Z",
  __v: 0
}

const newTasks = [
  {
    _id: "62bd67465d5e197ab673364e",
    description: "test1",
    completed: false,
    isEdit: false,
    userId: "62bd59b1e1828144fe562fb6",
    createdAt: "2022-06-30T09:05:10.242Z",
    updatedAt: "2022-06-30T09:05:10.242Z",
    __v: 0
  },
  {
    _id: "62bd67475d5e197ab6733650",
    description: "test2",
    completed: false,
    isEdit: false,
    userId: "62bd59b1e1828144fe562fb6",
    createdAt: "2022-06-30T09:05:11.660Z",
    updatedAt: "2022-06-30T09:05:11.660Z",
    __v: 0
  },
  {
    _id: "62bdasfasfasfqw5d5e197ab6733650",
    description: "test3",
    completed: false,
    isEdit: false,
    userId: "62bd59b1e1828144fe562fb6",
    createdAt: "2022-06-30T09:05:11.660Z",
    updatedAt: "2022-06-30T09:05:11.660Z",
    __v: 0
  },
  {
    _id: "62bd67475d5e197asfasfb6733650",
    description: "test4",
    completed: false,
    isEdit: false,
    userId: "62bd59b1e1828144fe562fb6",
    createdAt: "2022-06-30T09:05:11.660Z",
    updatedAt: "2022-06-30T09:05:11.660Z",
    __v: 0
  }
]

describe('todoReducer', () => {
  let newState: todoStateType
  beforeEach(() => {
    newState = state;
  });
  test(`${GET_TASKS.REQUEST}: loading should be truthy`, () => {
    newState = todoReducer(state, actions.getTasksRequest());
    expect(newState.loading).toBeTruthy();
  });
  test(`${GET_TASKS.SUCSSES}: tasks array should be filled with tasks objects`, () => {
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    expect(newState.tasks.length).toBe(4);
    expect(newState.loading).toBeFalsy();
    expect(newState.error).toBeNull();
  });
  test(`${GET_TASKS.FAILED}: error should be set`, () => {
    newState = todoReducer(state, actions.getTasksFailed({ massage: 'get tasks failed' }));
    expect(newState.tasks.length).toBe(0);
    expect(newState.loading).toBeFalsy();
    expect(newState.error).toEqual('get tasks failed');
  });
  test(`${ADD_TASK.REQUEST}: : loading should be truthy`, () => {
    newState = todoReducer(state, actions.addTaskRequest());
    expect(newState.loading).toBeTruthy();
  });
  test(`${ADD_TASK.SUCSSES}: tasks length should increase`, () => {
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    newState = todoReducer(newState, actions.addTaskSucsses({ newTaskBody: newTask }));
    expect(newState.tasks.length).toBeGreaterThan(newTasks.length);
    expect((newState.tasks.length) - (newTasks.length)).toBe(1);
    expect(newState.loading).toBeFalsy();
    expect(newState.error).toBeNull();
  });
  test(`${ADD_TASK.FAILED}: error should be set`, () => {
    newState = todoReducer(state, actions.addTaskFailed({ massage: 'add task failed' }));
    expect(newState.error).toEqual('add task failed');
  })
  test(`${DELETE_TASK.REQUEST}: loading should be truthy`, () => {
    newState = todoReducer(state, actions.deleteTaskRequest());
    expect(newState.loading).toBeTruthy();
  });
  test(`${DELETE_TASK.SUCSSES}: relevant tasks should be deleted`, () => {
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    expect(newState.tasks.length).toEqual(newTasks.length);
    const newStateWithDeletedTask = todoReducer(newState, actions.deleteTaskSucsses({ id: '62bd67465d5e197ab673364e' }));
    expect(newStateWithDeletedTask.tasks.length).toBe(newTasks.length - 1);
    expect(newStateWithDeletedTask.tasks.find(t => t._id === '62bd67465d5e197ab673364e')).toBeFalsy();
    expect(newStateWithDeletedTask.loading).toBeFalsy();
    expect(newStateWithDeletedTask.error).toBeFalsy();
  });
  test(`${DELETE_TASK.FAILED}: error should be set`, () => {
    newState = todoReducer(state, actions.deleteTaskFailed({ massage: 'delet task failed' }));
    expect(newState.error).toEqual('delet task failed');
  });
  test(`${COMPLETE_TASK.REQUEST}: loading should be truthy`, () => {
    newState = todoReducer(state, actions.completeTaskRequest());
    expect(newState.loading).toBeTruthy();
  });
  test(`${COMPLETE_TASK.SUCSSES}: relevant tasks should be completed`, () => {
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    const newStateWithCompletedTask = todoReducer(newState, actions.completeTaskSucsses({ id: '62bd67465d5e197ab673364e' }));
    expect(newStateWithCompletedTask.tasks.find(t => t._id === '62bd67465d5e197ab673364e')?.completed).toBeTruthy();
    expect(newStateWithCompletedTask.tasks.filter(t => t.completed === false).length).toBe(newState.tasks.length - 1);
    expect(newStateWithCompletedTask.error).toBeNull();
    expect(newStateWithCompletedTask.loading).toBeFalsy();
  });
  test(`${COMPLETE_TASK.FAILED}: error should be set`, () => {
    newState = todoReducer(state, actions.completeTaskFailed({ massage: 'complete task failed' }));
    expect(newState.error).toEqual('complete task failed');
  });
  test(`${CLEAR_TASKS.REQUEST}: loading should be truthy`, () => {
    newState = todoReducer(state, actions.clearTasksRequest());
    expect(newState.loading).toBeTruthy();
  });
  test(`${CLEAR_TASKS.SUCSSES}: relevant tasks should be deleted`, () => {
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    const newTasksFromDb = [
      {
        _id: "62bd67465d5e197ab673364e",
        description: "test1",
        completed: false,
        isEdit: false,
        userId: "62bd59b1e1828144fe562fb6",
        createdAt: "2022-06-30T09:05:10.242Z",
        updatedAt: "2022-06-30T09:05:10.242Z",
        __v: 0
      },
      {
        _id: "62bd67475d5e197ab6733650",
        description: "test2",
        completed: false,
        isEdit: false,
        userId: "62bd59b1e1828144fe562fb6",
        createdAt: "2022-06-30T09:05:11.660Z",
        updatedAt: "2022-06-30T09:05:11.660Z",
        __v: 0
      },
    ]
    const newStateWithClearedTasks = todoReducer(newState, actions.clearTasksSucsses({ newTasks: newTasksFromDb }));
    expect(newStateWithClearedTasks.tasks.length).toBe(newTasksFromDb.length);
    expect(newStateWithClearedTasks.loading).toBeFalsy();
    expect(newStateWithClearedTasks.error).toBeNull();
  })
  test(`${CLEAR_TASKS.FAILED}: error should be set`, () => {
    newState = todoReducer(state, actions.clearTasksFailed({ massage: 'clear tasks failed' }));
    expect(newState.error).toEqual('clear tasks failed');
  });
  test(`${CHECK_ALL.REQUEST}: loading should be truthy`, () => {
    newState = todoReducer(state, actions.checkAllRequest());
    expect(newState.loading).toBeTruthy();
  });
  test(`${CHECK_ALL.SUCSSES}: all tasks should be checked`, () => {
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    expect(newState.tasks.filter(t => t.completed === true).length).toBe(0);
    const checkedTasks = newState.tasks.map(t => {
      return {
        ...t,
        completed: true
      };
    })
    const newStateWithCheckedTasks = todoReducer(newState, actions.checkAllSucsses({ newTasks: checkedTasks }));
    expect(newStateWithCheckedTasks.tasks.filter(t => t.completed === false).length).toBe(0);
    expect(newState.loading).toBeFalsy();
    expect(newState.error).toBeNull();
  });
  test(`${CHECK_ALL.FAILED}: error should be set`, () => {
    newState = todoReducer(state, actions.checkAllFailed({ massage: 'check tasks failed' }));
    expect(newState.error).toEqual('check tasks failed');
  });
  test(`${TOGGLE.REQUEST}: loading should be truthy`, () => {
    newState = todoReducer(state, actions.toggleRequest());
    expect(newState.loading).toBeTruthy();
  });
  test(`${TOGGLE.SUCSSES}: relevant tasks should be set/unset in Edit Mode`, () => {
    const taskId = '62bd67465d5e197ab673364e';
    const description = 'Edit Mode was changed'
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    expect(newState.tasks.find(t => t._id === taskId)?.isEdit).toBeFalsy();
    expect(newState.tasks.find(t => t._id === taskId)?.description).toEqual('test1');
    const newStateWithEditMode = todoReducer(newState, actions.toggleSucsses({ id: taskId, description }));
    expect(newStateWithEditMode.tasks.find(t => t._id === taskId)?.isEdit).toBeTruthy();
    expect(newStateWithEditMode.tasks.find(t => t._id === taskId)?.description).toEqual(description);
    expect(newStateWithEditMode.loading).toBeFalsy();
    expect(newStateWithEditMode.error).toBeNull();
  });
  test(`${TOGGLE.FAILED}: error should be set`, () => {
    newState = todoReducer(state, actions.toggleFailed({ massage: 'toggle tasks failed' }));
    expect(newState.error).toEqual('toggle tasks failed');
  });
  test(`${LOG_OUT.SUCSSES}: log user out`, () => {
    newState = todoReducer(state, actions.getTasksSucsses({ newTasks }));
    expect(newState.tasks.length).toBeTruthy();
    const userLoggedOutState = todoReducer(newState, authActions.logUserOut());
    expect(userLoggedOutState.tasks.length).toBeFalsy();
    expect(userLoggedOutState.loading).toBeFalsy();
    expect(userLoggedOutState.error).toBeNull();
  })
})