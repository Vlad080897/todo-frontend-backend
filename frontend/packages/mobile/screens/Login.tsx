import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Button, Stack, TextInput } from "@react-native-material/core";
import { LOG_IN, SIGN_UP } from '@todo/client-core/src/actions/actionsNames';
import { getLoginError } from "@todo/client-core/src/selectors/todoSelectors";
import { getLoading } from "@todo/client-core/src/selectors/userSelectors";
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';


const Login = () => {
  const [activeForm, setActiveForm] = useState<'Login' | 'Sign Up'>('Login');
  const loading = useSelector(getLoading)
  console.log(loading);
  
  const error = useSelector(getLoginError);

  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ email: '', pass: '' }}
      onSubmit={(values) => {
        const { email, pass } = values
        if (activeForm === "Login") {
          dispatch({ type: LOG_IN.CALL, email, password: pass });
          return;
        }
        dispatch({ type: SIGN_UP.CALL, email, password: pass });
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <>
          <View style={styles.loginContainer}>
            <View style={styles.loginBlock}>
              <Text style={styles.loginTitle}>
                {activeForm}
              </Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
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
                  title={activeForm}
                  style={styles.btn}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {activeForm === 'Sign Up' ?
                    <>
                      <Text>Already have an account?</Text>
                      <Button disabled={loading} variant="text" title="Login" onPress={() => setActiveForm('Login')} />
                    </>
                    :
                    <>
                      <Text>Don't have account yet?</Text>
                      <Button disabled={loading} variant="text" title="Sign up" onPress={() => setActiveForm('Sign Up')} />
                    </>
                  }
                </View>
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
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginBlock: {
    width: '80%',
    height: 400,

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
  },
  error: {
    color: 'red',
    borderWidth: 1,
    borderColor: 'red',
    padding: 5,
    borderRadius: 3
  }
})