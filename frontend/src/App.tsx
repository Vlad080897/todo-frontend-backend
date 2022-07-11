import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import { GET_TASKS } from './actions/actionsNames';
import Error from './components/Error';
import Footer from './components/Footer';
import Header from './components/Header';
import Todo from './components/Todo';
import UserInfo from './components/UserInfo';
import { all } from './routes/routes';
import { getError } from './selectors/todoSelectors';
import { getUserSelector } from './selectors/userSelectors';

const socket = io();

const App = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUserSelector);
  const error = useSelector(getError);

  useEffect(() => {
    if (user) {
      navigate(`/${all}`);
      dispatch({ type: GET_TASKS.CALL, userId: user.id });
      socket.emit('join', { userId: user?.id })
    }
  }, [user]);

  useEffect(() => {
    socket.on('receive-new-task', (data: any) => {
      dispatch({ type: GET_TASKS.CALL, userId: user?.id })
    })

    socket.on('receive-deleted-task', (data: any) => {
      dispatch({ type: GET_TASKS.CALL, userId: user?.id })
    })

    return () => {
      socket.off('receive-new-task');
      socket.off('delete-task');
    }
  }, [])

  return (
    <>
      <UserInfo socket={socket} />
      <div className="todoapp">
        <Error error={error} />
        <Header
          user={user}
          socket={socket}
        />
        <Todo
          userId={user && user.id}
          socket={socket}
        />
        <Footer userId={user && user.id} />
      </div>
    </>
  );
}

export default App;
