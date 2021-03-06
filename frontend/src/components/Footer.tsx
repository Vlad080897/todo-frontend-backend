import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CLEAR_CLICK } from '../actions/actionsNames';
import { active, all, completed } from '../routes/routes';
import { getAllTasksLength, getItemsLeftSelector, getTasksSelector } from '../selectors/todoSelectors';

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const itemsLeft = useSelector(getItemsLeftSelector);
  const haveTasks = useSelector(getAllTasksLength);
  const haveCompleted = useSelector(getTasksSelector).filter(t => t.completed === true).length

  const handleClearCompleted = () => {
    dispatch({ type: CLEAR_CLICK });
  }

  const updatePath = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {haveTasks ? <footer className="footer" id="footer_info_wrapper">
        <span className="todo-count">{`${itemsLeft} items left`}</span>
        <ul className="filters">
          <li>
            <button
              type="button"
              className={`${location.pathname.includes(all) ? 'activeButton' : ''}`}
              onClick={() => updatePath(all)}
            >
              All
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${location.pathname.includes(active) ? 'activeButton' : ''}`}
              onClick={() => updatePath(active)}
            >
              Active
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${location.pathname.includes(completed) ? 'activeButton' : ''}`}
              onClick={() => updatePath(completed)}
            >
              Completed
            </button>
          </li>
        </ul>
        <button
          type="button"
          className={`${haveCompleted ? 'clear-completed visible' : 'hidden'}`}
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      </footer > : null}
    </>

  )
}

export default Footer