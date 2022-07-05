import { runSaga } from 'redux-saga';
import { hashPassword, login, logout, signUp, getUser } from '../sagas/authSaga';
import { GET_USER, LOG_IN, LOG_OUT, SIGN_UP } from './../actions/actionsNames';
import { authApi } from './../api/authApi';

const user = {
  password: '123',
  email: 'test-email@test.com',
  __v: 0,
  _id: 'user-test-id'
}

const refreshToken = 'abc'

const createAxiosResponse = (code: number, payload: any) => {
  return {
    data: payload,
    status: code,
    statusText: '',
    headers: {},
    config: {},
  }
}

const createAxiosError = (code: number, payload: any) => {
  return {
    message: 'AxiosError',
    isAxiosError: true,
    config: {},
    toJSON: () => Object,
    name: 'AxiosError',
    response: {
      data: {
        error: payload
      },
      status: code,
      statusText: '',
      headers: {},
      config: {}
    },
  }
}

describe('Auth-sagas', () => {

  describe('sign-up-saga', () => {
    let dispatched: actionType[] = []

    type actionType = {
      type: string,
      payload?: {
        user: {
          id: string,
          email: string
        }
      } | null
    }

    beforeEach(() => {
      dispatched = []
      jest.clearAllMocks()
    })

    const action = {
      type: SIGN_UP.CALL,
      email: 'email',
      password: '123'
    }

    test('sign-up-success', async () => {
      const response = createAxiosResponse(200, { id: user._id, userEmail: user.email })
      const hashedPassword: string = await hashPassword(action.password)
      authApi.signup = jest.fn().mockResolvedValue(response)

      await runSaga({

        dispatch: (action: {
          type: string,
          payload?: {
            user: {
              id: string,
              email: string
            }
          } | null
        }) => dispatched.push(action)
        //@ts-ignore
      }, signUp, action).toPromise()

      expect(authApi.signup).toHaveBeenCalledTimes(1);
      expect(authApi.signup).toHaveBeenCalledWith(action.email, hashedPassword);

      expect(dispatched).toEqual([
        {
          type: GET_USER.SUCSSES,
          payload: {
            user: { id: user._id, email: user.email }
          }
        }
      ]);

    })

    test('sign-up-failed-401', async () => {
      const error = createAxiosError(401, { email: 'Invalid email', password: '' })
      authApi.signup = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action),
      },
        //@ts-ignore 
        signUp, action).toPromise()

      expect(dispatched).toEqual([
        {
          type: GET_USER.FAILED,
          payload: {
            massage: "Invalid email",
          }
        }
      ])
    })
  })

  describe('login-saga', () => {

    const action = {
      type: LOG_IN.CALL,
      email: 'email@test.com',
      password: '123'
    }

    let dispatched: actionType[] = [];

    beforeEach(() => {
      dispatched = [];
    })

    type actionType = {
      type: string,
      payload?: {
        user: {
          id: string,
          email: string
        }
      }
    }


    test('login-success', async () => {
      const response = createAxiosResponse(200, { user, refreshToken });
      authApi.login = jest.fn().mockResolvedValue(response);
      const hashedPassword: string = await hashPassword(action.password)
      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      },
        //@ts-ignore
        login, action).toPromise()

      expect(authApi.login).toHaveBeenCalledTimes(1);
      expect(authApi.login).toHaveBeenCalledWith(action.email, hashedPassword);
      expect(dispatched).toEqual([
        {
          type: GET_USER.SUCSSES,
          payload: {
            user: {
              email: 'test-email@test.com',
              id: user._id
            }
          }
        }
      ])
    })

    test('login-failed-401', async () => {
      const error = createAxiosError(401, { error: 'Invalid credentials' });
      authApi.login = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      },
        //@ts-ignore
        login, action).toPromise()

      expect(dispatched).toEqual([
        {
          type: GET_USER.FAILED,
          payload: { massage: { error: 'Invalid credentials' } }
        }
      ])


    })

  })


  describe('log-out-saga', () => {

    const response = createAxiosResponse(200, null);
    authApi.logout = jest.fn().mockResolvedValue(response);

    let dispatched: actionType[] = [];

    beforeEach(() => {
      dispatched = [];
    })

    type actionType = {
      type: string
    }

    test('logout-succses', async () => {

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      }, logout).toPromise()

      expect(authApi.logout).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: LOG_OUT.SUCSSES,
        }
      ])
    })
  })

  describe('get-user-saga', () => {

    let dispatched: actionType[] = [];

    beforeEach(() => {
      dispatched = []
      jest.clearAllMocks()
    })

    type actionType = {
      type: string,
      payload?: {
        user: {
          id: string,
          email: string
        }
      }
    }

    test('get-user-success', async () => {
      const response = createAxiosResponse(200, user);
      authApi.getUser = jest.fn().mockResolvedValue(response);



      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      }, getUser).toPromise()


      expect(authApi.getUser).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        {
          type: GET_USER.REQUEST
        },
        {
          type: GET_USER.SUCSSES,
          payload: {
            user: {
              id: user._id,
              email: user.email
            }
          }
        }
      ])
    })

    test('get-user-failed', async () => {

      const error = createAxiosError(403, null);
      authApi.getUser = jest.fn().mockRejectedValue(error);

      await runSaga({
        dispatch: (action: actionType) => dispatched.push(action)
      }, getUser).toPromise()

      expect(dispatched).toEqual([
        { type: GET_USER.REQUEST },
        { type: GET_USER.SUCSSES, payload: null }
      ])


    })
  })
})

