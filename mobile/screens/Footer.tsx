import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text>0 items left</Text>
      <View style={{flexDirection: 'row'}}>
        <Button title='All' />
        <Button title='Active' />
        <Button title='Compl' />
      </View>
      <Button title='Clear' />
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 5,
    height: 40,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})