import { Alert, AlertTitle } from '@mui/material'
import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { getError } from '../selectors/todoSelectors';

const Error = () => {
  const error = useAppSelector(getError);
  return (
    <>
      {error ? <Alert severity="error">
        <AlertTitle>{error}</AlertTitle>
      </Alert> : null}
    </>

  )
}

export default Error