import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { GET_USER } from "@todo/client-core/src/actions/actionsNames";
import { privateRoutes, publicRoutes } from './routes/routes';
import {
  getLoading,
  getUserSelector,
} from "@todo/client-core/src/selectors/userSelectors";
import Login from './components/Login';
import CommonStore from '@todo/client-core/src/commonStore/commonStore'
import { changeAxiosInstance } from '@todo/client-core/src/api/api';


CommonStore.setStore({
  getItem: async (key: string) => await localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key)
})

//changeAxiosInstance('http://localhost:8000')

const AppRoutes = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserSelector);
  const loading = useSelector(getLoading);

  useEffect(() => {
    dispatch({ type: GET_USER.CALL });
  }, [])

  if (loading) {
    return null;
  }
  return (
    <>
      {user ? (
        <Routes >
          {publicRoutes.map(route => {
            return <Route
              key={route.path}
              path={route.path}
              element={<route.component />} />
          })}
        </Routes>
      )
        :
        (
          <Routes >
            {privateRoutes.map(route => {
              return <Route
                key={route.path}
                path={route.path}
                element={<route.component />} />
            })}
            <Route path='*' element={<Login />} />
          </Routes>
        )}

    </>
  )
}

export default AppRoutes