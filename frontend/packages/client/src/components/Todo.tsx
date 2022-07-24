import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { CHECK_ALL } from "@todo/client-core/src/actions/actionsNames";
import { active, completed } from '../routes/routes'
import {
  getLoadingSelector,
  getTasksSelector,
} from "@todo/client-core/src/selectors/todoSelectors";
import { TaskType } from "@todo/client-core/src/types/todoTypes";
import Task from './Task'
import Loader from './Loader';

const Todo: React.FC<{ userId: string | null, socket: Socket }> = ({ userId, socket }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;
  const tasks = useSelector(getTasksSelector);
  const [currentTasks, setCurrentTasks] = useState<TaskType[]>()
  const loading = useSelector(getLoadingSelector);
  const checkAllBtn = useRef<HTMLInputElement | null>(null);
  const haveNotCompleted = useMemo(() => tasks.find(t => t.completed === false), [tasks])

  useEffect(() => {
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
    isAllChecked();
  }, [tasks, haveNotCompleted])

  useEffect(() => {
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
    sortByPath();
  }, [tasks, path])

  const handleCheckAll = useCallback(() => {
    dispatch({ type: CHECK_ALL.CALL, checkAllBtn, userId });
  }, [userId, dispatch])

  return (
    <section className="main">
      {loading ? <Loader /> : <input
        className="toggle-all"
        type="checkbox"
        id="toggle-all"
        onChange={handleCheckAll}
        ref={checkAllBtn}
      />}
      <label htmlFor="toggle-all"></label>
      <ul className="todo-list" id="todos-wrapper">
        {currentTasks && currentTasks.map(task => (
          <Task
            key={task._id}
            task={task}
            socket={socket}
          />
        ))}
      </ul>
    </section>
  )
}

export default Todo