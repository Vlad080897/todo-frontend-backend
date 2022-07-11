import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { GET_USER } from './actions/actionsNames';
import { privateRoutes, publicRoutes } from './routes/routes';
import { getLoading, getUserSelector } from './selectors/userSelectors';
import Login from './components/Login';

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