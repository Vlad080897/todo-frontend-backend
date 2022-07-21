import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from './Login'
import { useSelector } from 'react-redux'
import { getUserSelector } from '@todo/client-core/src/selectors/userSelectors'

const AppRoot = () => {
  const user = useSelector(getUserSelector)
  console.log(user);

  return (
    <View style={styles.todoapp}>
      {/* <Header />
        <Todo />
        <Footer /> */}
      <Login />
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