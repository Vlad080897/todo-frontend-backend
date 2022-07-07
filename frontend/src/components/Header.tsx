import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from "socket.io-client";
import { ADD_TASK, GET_TASKS } from '../actions/actionsNames';
import { getLoadingSelector } from '../selectors/todoSelectors';
import { UserType } from '../types/todoTypes';
import Loader from './Loader';

export const socket: Socket = io();

const Header: React.FC<{ user: UserType | null }> = ({ user }) => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoadingSelector);
  const formik = useFormik({
    initialValues: {
      new_todo_description: ''
    },

    onSubmit: async (values: valuesType, { resetForm }) => {
      const newTask = {
        description: values.new_todo_description,
        completed: false,
        isEdit: false,
        userId: user?.id
      };

      dispatch({ type: ADD_TASK.CALL, newTask });
      socket.emit('add-new-task', { userId: user?.id });
      resetForm();
    }
  });

  useEffect(() => {
    if (user?.id) {
      socket.emit('join', { userId: user?.id });
    }
  }, [])

  useEffect(() => {
    socket.on('receive_message', (data: any) => {
      debugger
      dispatch({ type: GET_TASKS.CALL, userId: user?.id })
    })
  }, [socket])

  return (
    <header className="header">
      <h1>todos</h1>
      <form onSubmit={formik.handleSubmit} style={{ display: 'flex' }}>
        {loading ? <Loader /> : ''}
        <input
          name='new_todo_description'
          type="text"
          className="new-todo"
          placeholder="What needs to be done?"
          value={formik.values.new_todo_description}
          onChange={formik.handleChange}
          autoFocus
        />
      </form>
    </header>
  )
}

export default Header

type valuesType = {
  new_todo_description: string
}