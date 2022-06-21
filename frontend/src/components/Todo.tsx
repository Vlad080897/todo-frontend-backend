import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { CHECK_ALL_CLICK } from '../actions/actionsNames'
import { active, completed } from '../routes/routes'
import { getLoadingSelector, getTasksSelector } from '../selectors/todoSelectors'
import { TaskType } from '../types/todoTypes'
import Task from './Task'

const Todo = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;
  const tasks = useSelector(getTasksSelector);
  const [currentTasks, setCurrentTasks] = useState<TaskType[]>()
  const loading = useSelector(getLoadingSelector);
  const checkAllBtn = useRef<HTMLInputElement | null>(null);
  const haveNotCompleted = tasks.find(t => t.completed === false);


  const isAllChecked = () => {
    if (checkAllBtn.current) {
      if (haveNotCompleted) {
        checkAllBtn.current.checked = false;

      }
      if (!haveNotCompleted && tasks.length) {
        const fromLocal = tasks.find(t => t.completed === false);
        if (fromLocal) {
          checkAllBtn.current.checked = false;
          return;
        };
        checkAllBtn.current.checked = true;
        return;
      };
      checkAllBtn.current.checked = false;
    }
  }

  const sortByPath = () => {
    if (path.includes(active)) {
      const newTasks = tasks.filter(t => t.completed === false);
      setCurrentTasks(newTasks);
      return;
    }
    if (path.includes(completed)) {
      const newTasks = tasks.filter(t => t.completed === true);
      setCurrentTasks(newTasks);
      return;
    }
    setCurrentTasks(tasks)
  }

  useEffect(() => {
    isAllChecked();
  }, [tasks])

  useEffect(() => {
    sortByPath();
  }, [tasks, path])

  const handleCheckAll = () => {
    dispatch({ type: CHECK_ALL_CLICK, path: location.pathname });
  }

  return (
    <section className="main">
      {loading ? null : <input
        className="toggle-all"
        type="checkbox"
        id="toggle-all"
        onChange={handleCheckAll}
        ref={checkAllBtn}
      //disabled={loading ? true : false}
      />}

      <label htmlFor="toggle-all"></label>
      <ul className="todo-list" id="todos-wrapper">
        {currentTasks && currentTasks.map(task => (
          <Task
            key={task._id}
            task={task}
          />
        ))}
      </ul>
    </section>
  )
}

export default Todo