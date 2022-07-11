import { useFormik } from 'formik'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { COMPLETE_TASK, DELETE_TASK, TOGGLE, UPDATE } from '../actions/actionsNames'
import { TaskType } from '../types/todoTypes'

const Task: React.FC<CurrentTaskType> = ({ task, socket }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { _id, completed, description, isEdit, userId } = task;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isBlur, setIsBlur] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      description: description
    },
    onSubmit: () => {
      setIsBlur(false);
      dispatch({ type: UPDATE.CALL, id: _id, description: formik.values.description, isEdit })
    }
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [isEdit])

  const handleDelete = useCallback(() => {
    socket.emit('delete-task', { id: _id, userId })
    dispatch({ type: DELETE_TASK.CALL, id: _id })
  }, [])

  const handleComplete = useCallback(() => {
    dispatch({ type: COMPLETE_TASK.CALL, id: _id, completed, path: location.pathname });
  }, [task.completed])

  const handleBlur = useCallback(() => {
    if (isBlur) {
      dispatch({ type: UPDATE.CALL, id: _id, description: formik.values.description, isEdit })
    }
  }, [isEdit, isBlur, formik.values.description])

  const handleToggle = useCallback(() => {
    setIsBlur(true);
    dispatch({ type: TOGGLE.CALL, description, id: _id, isEdit })
  }, [isEdit, isBlur])

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
  task: TaskType,
  socket: Socket
}