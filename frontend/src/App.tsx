import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { GET_TASKS_CLICK } from './actions/actionsNames';
import Error from './components/Error';
import Footer from './components/Footer';
import Header from './components/Header';
import Todo from './components/Todo';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/all');
    dispatch({ type: GET_TASKS_CLICK });
  }, [])
  return (
    <div className="todoapp">
      <Error />
      <Header />
      <Todo />
      <Footer />
    </div>
  );
}

export default App;
