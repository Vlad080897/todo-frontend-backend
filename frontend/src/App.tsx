import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { GET_TASKS } from './actions/actionsNames';
import Error from './components/Error';
import Footer from './components/Footer';
import Header from './components/Header';
import Todo from './components/Todo';
import UserInfo from './components/UserInfo';
import { all } from './routes/routes';
import { getError } from './selectors/todoSelectors';
import { getUserSelector } from './selectors/userSelectors';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUserSelector);
  const error = useSelector(getError);

  useEffect(() => {
    if (user) {
      navigate(`/${all}`);
      dispatch({ type: GET_TASKS.CALL, userId: user.id });
    }
  }, [user]);

  return (
    <>
      <UserInfo />
      <div className="todoapp">
        <Error error={error} />
        <Header user={user} />
        <Todo />
        <Footer />
      </div>
    </>
  );
}

export default App;
