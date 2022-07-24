import { Button } from '@react-native-material/core'
import { GET_USER } from '@todo/client-core/src/actions/actionsNames'
import { getTasksSelector } from '@todo/client-core/src/selectors/todoSelectors'
import { getLoading, getUserSelector } from '@todo/client-core/src/selectors/userSelectors'
import { TaskType } from '@todo/client-core/src/types/todoTypes'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { LOG_OUT } from '../actions/actionsNames'
import Footer from './Footer'
import Header from './Header'
import Login from './Login'
import Todo from './Todo'

const AppRoot = () => {
  const dispatch = useDispatch();

  const [path, setPath] = useState<'all' | 'active' | 'completed'>('all');
  const [currentTasks, setCurrentTasks] = useState<TaskType[] | []>([]);
  const user = useSelector(getUserSelector);
  const tasks = useSelector(getTasksSelector);
  const loading = useSelector(getLoading);

  useEffect(() => {
    dispatch<{ type: typeof GET_USER.CALL }>({ type: GET_USER.CALL });
  }, [])

  useEffect(() => {
    if (path === 'active') {
      const newTasks = tasks.filter(t => t.completed === false);
      setCurrentTasks(newTasks);
      return;
    }
    if (path === 'completed') {
      const newTasks = tasks.filter(t => t.completed === true);
      setCurrentTasks(newTasks);
      return;
    }
    setCurrentTasks(tasks)
  }, [path, tasks])

  const handleLogOut = () => {
    dispatch<{ type: typeof LOG_OUT.CALL }>({ type: LOG_OUT.CALL })
  }

  if (loading) return null;

  if (!user) return <Login />

  return (
    <View style={styles.todoapp}>
      <Header
        id={user.id}
      />
      <Todo
        id={user.id}
        currentTasks={currentTasks}
      />
      <Footer setPath={setPath} />
      <Button title="Log out" onPress={handleLogOut} />
    </View>
  )
}

export default AppRoot

const styles = StyleSheet.create({
  todoapp: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
})