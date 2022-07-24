import { StyleSheet, Text, View } from 'react-native'
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core"
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from 'react'
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { LOG_IN } from '@todo/client-core/src/actions/actionsNames';


const Login = () => {
  const [activeForm, setActiveForm] = useState<string>('Login');

  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ email: '', pass: '' }}
      onSubmit={(values) => {
        const { email, pass } = values
        dispatch({ type: LOG_IN.CALL, email, password: pass });
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <>
          <View style={styles.loginContainer}>
            <View style={styles.loginBlock}>
              <Text style={styles.loginTitle}>
                {activeForm}
              </Text>
              <Stack>
                <TextInput
                  label={'Login'}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onSubmitEditing={() => handleSubmit()}
                  style={styles.loginTextField}
                  leading={props => <Icon name="account" {...props} />}
                />
                <TextInput
                  label={'Password'}
                  value={values.pass}
                  onChangeText={handleChange('pass')}
                  onSubmitEditing={() => handleSubmit}
                  style={styles.loginTextField}
                  leading={props => <Icon name="passport" {...props} />}
                />
                <Button
                  title='Submit'
                  style={styles.btn}
                  onPress={() => handleSubmit()}
                />
              </Stack>
            </View>
          </View>
        </>
      )}
    </Formik>
  )
}

export default Login

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  loginBlock: {
    width: '80%',
    height: 400,
    backgroundColor: 'red',
    alignSelf: "center",
  },
  loginTitle: {
    fontSize: 32,
    padding: 10
  },
  loginTextField: {
    width: "80%",
    marginLeft: 10,
    marginTop: 20
  },
  btn: {
    marginTop: 10,
  }
})