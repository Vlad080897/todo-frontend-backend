import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { globalStyles } from '../styles/commonStyles';


const Header = () => {
  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, handleChange, handleSubmit, handleBlur }) => (
        <>
          <Text style={styles.headerTitle}>todos</Text>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <BouncyCheckbox
              style={globalStyles.checkBoxIcon}
              fillColor={'black'}
            />
            <TextInput
              value={values.email}
              style={globalStyles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              onSubmitEditing={() => handleSubmit()}
              placeholder='Add your todo here'
            />
          </View>
        </>
      )}
    </Formik >
  )
}

export default Header

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 60,
    fontWeight: '400',
    textAlign: 'center',
    color: 'rgba(175, 47, 47, 0.15)',

  },
})