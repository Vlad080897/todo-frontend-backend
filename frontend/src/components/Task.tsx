import React, { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { TaskType } from '../types/todoTypes'
import { COMPLETE_TASK_CLICK, DELETE_CLICK, TOGGLE_CLICK, UPDATE_TASK } from '../actions/actionsNames'

const Task: React.FC<CurrentTaskType> = ({ task }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { _id, completed, description, isEdit } = task;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isBlur, setIsBlur] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      description: description
    },
    onSubmit: () => {
      setIsBlur(false);
      dispatch({ type: UPDATE_TASK, id: _id, description: formik.values.description, isEdit })
    }
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [isEdit])

  const handleDelete = () => {
    dispatch({ type: DELETE_CLICK, id: _id })
  }

  const handleComplete = () => {
    dispatch({ type: COMPLETE_TASK_CLICK, id: _id, completed, path: location.pathname });
  }

  const handleBlur = () => {
    if (isBlur) {
      dispatch({ type: UPDATE_TASK, id: _id, description: formik.values.description, isEdit })
    }
  }

  const handleToggle = () => {
    setIsBlur(true);
    dispatch({ type: TOGGLE_CLICK, description, id: _id, isEdit })
  }
  return (
    <li className={`${isEdit ? 'editing' : ''}`}>
      <div className="view">
        <input
          readOnly
          type="checkbox"
          className="toggle"
          checked={completed ? true : false}
          onChange={handleComplete}
        />
        <label
          className={`description ${completed ? 'completed' : ''}`}
          onDoubleClick={handleToggle}
        >
          {description}
        </label>
        <button
          type="button"
          className="destroy"
          onClick={handleDelete}
        />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <input
          name='description'
          type="text"
          className="edit"
          value={formik.values.description}
          onChange={formik.handleChange}
          ref={inputRef}
          onBlur={handleBlur}
        />
      </form>
    </li >
  )
}

export default Task

interface CurrentTaskType {
  task: TaskType
}