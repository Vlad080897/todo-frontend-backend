import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { GET_TASKS } from './actions/actionsNames';
import Footer from './components/Footer';
import Header from './components/Header';
import Todo from './components/Todo';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/all');
    dispatch({ type: GET_TASKS });
  }, [])
  return (
    <div className="todoapp">
      <Header />
      <Todo />
      <Footer />
    </div>
  );
}

export default App;
