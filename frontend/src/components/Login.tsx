import { AppBar, Box, Button, Divider, TextField, Toolbar, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN, SIGN_UP } from '../actions/actionsNames';
import { getError } from '../selectors/userSelectors';
import Error from './Error';

const Login = () => {
  const [activeForm, setActiveForm] = useState<string>('Login');
  const error = useSelector(getError);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: '',
      pass: ''
    },
    onSubmit: () => {
      const { email, pass } = formik.values
      if (activeForm === 'SignUp') {
        dispatch({ type: SIGN_UP.CALL, email, password: pass });
        return;
      }
      dispatch({ type: LOG_IN.CALL, email, password: pass });

    }
  })

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Todo App
            </Typography>
            <Button
              color={activeForm === 'Login' ? 'warning' : 'inherit'}
              variant='outlined' sx={{ mr: 1 }}
              onClick={() => setActiveForm('Login')}
            >Login</Button>
            <Button
              color={activeForm === 'SignUp' ? 'warning' : 'inherit'}
              variant='outlined'
              onClick={() => setActiveForm('SignUp')}

            >
              SignUp</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          height: '500px',
          bgcolor: 'white',
          mt: 5,
          borderRadius: 2,
          pl: 2,
          pr: 2
        }}
      >
        <Error error={error} />
        <Typography
          sx={{ fontSize: '2rem', pt: 3, pl: 3 }}
        >
          {activeForm}
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <form action="" onSubmit={formik.handleSubmit} >
          <TextField
            name={'email'}
            value={formik.values.email}
            onChange={formik.handleChange}
            label="Email"
            variant="standard"
            sx={{ width: '100%', mb: 2 }}
          />
          <TextField
            name={'pass'}
            type='password'
            value={formik.values.pass}
            onChange={formik.handleChange}
            label="Password"
            variant="standard"
            sx={{ width: '100%', mb: 2 }}
          />
          {activeForm === 'Login' ? <Button color='primary' variant='contained' type='submit'>Login </Button> :
            <Button color='primary' variant='contained' type='submit'>Sign up</Button>}
          <Typography>if you don't have account yet, you can <Button variant='text' onClick={() => setActiveForm('SignUp')}>Create Account</Button> </Typography>
        </form>

      </Box>
    </>

  )
}

export default Login