import { useFormik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_NEW_TASK_CLICK } from '../actions/actionsNames'
import { getLoadingSelector } from '../selectors/todoSelectors'
import Loader from './Loader'

const Header = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoadingSelector);

  const formik = useFormik({
    initialValues: {
      new_todo_description: ''
    },
    onSubmit: (values: valuesType, { resetForm }) => {
      const newTask = {
        description: values.new_todo_description,
        completed: false,
        isEdit: false
      };
      dispatch({ type: ADD_NEW_TASK_CLICK, newTask });
      resetForm();
    }
  });

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