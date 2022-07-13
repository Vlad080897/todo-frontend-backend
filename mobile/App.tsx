import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from './screens/Header'
import { useFonts } from 'expo-font';
import Todo from './screens/Todo';
import Footer from './screens/Footer';


const App = () => {
  const [loaded] = useFonts({
    sansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
    sansReg: require('./assets/fonts/OpenSans-Regular.ttf')
  });

  if (!loaded) return null

  return (
      <View style={styles.todoapp}>
        <Header />
        <Todo />
        <Footer />
      </View>
  )
}

export default App

const styles = StyleSheet.create({
  todoapp: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  }
})