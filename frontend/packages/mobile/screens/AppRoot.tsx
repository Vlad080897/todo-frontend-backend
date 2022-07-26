import { MaterialIcons } from '@expo/vector-icons'
import { AppBar, Box } from '@react-native-material/core'
import { GET_USER, LOG_OUT } from '@todo/client-core/src/actions/actionsNames'
import { getTasksSelector } from '@todo/client-core/src/selectors/todoSelectors'
import { getLoading, getUserSelector } from '@todo/client-core/src/selectors/userSelectors'
import { TaskType } from '@todo/client-core/src/types/todoTypes'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Footer from './Footer'
import Header from './Header'
import Login from './Login'
import Todo from './Todo'

const AppRoot = () => {
  const dispatch = useDispatch();

  const tasks = useSelector(getTasksSelector);
  const [path, setPath] = useState<'all' | 'active' | 'completed'>('all');
  const [currentTasks, setCurrentTasks] = useState<TaskType[] | []>([]);
  const user = useSelector(getUserSelector);
  const loading = useSelector(getLoading);

  useEffect(() => {
    dispatch<{ type: typeof GET_USER.CALL }>({ type: GET_USER.CALL });
  }, [])

  useEffect(() => {
    if (path === 'active') {
      const newTasks = tasks.filter(t => t.completed === false);
      return setCurrentTasks(newTasks);
    }
    if (path === 'completed') {
      const newTasks = tasks.filter(t => t.completed === true);
      return setCurrentTasks(newTasks);
    }
    setCurrentTasks(tasks);
  }, [path, tasks])

  const handleLogOut = () => {
    dispatch<{ type: typeof LOG_OUT.CALL }>({ type: LOG_OUT.CALL })
  }

  //if (loading) return null;

  if (!user) return <Login />

  return (
    <>
      <AppBar style={styles.appBar}>
        <TouchableOpacity>
          <Box>
            <MaterialIcons
              name='logout'
              size={30}
              onPress={handleLogOut}

            />
          </Box>
        </TouchableOpacity>
      </AppBar>
      <View style={styles.todoapp}>
        <Header
          id={user.id}
        />
        <Todo
          id={user.id}
          currentTasks={currentTasks}
        />
        <Footer
          setPath={setPath}
          path={path}
        />
      </View>
    </>
  )
}

export default AppRoot

const styles = StyleSheet.create({
  todoapp: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5
  },
  appBar: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 10,
    backgroundColor: '#f5f5f5',
    elevation: 0
  }
})