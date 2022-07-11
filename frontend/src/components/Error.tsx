import { Alert, AlertTitle } from '@mui/material';
import React from 'react';

const Error: React.FC<{ error: string | null }> = ({ error }) => {
  return (
    <>
      {error ? <Alert severity="error">
        <AlertTitle>{error}</AlertTitle>
      </Alert> : null}
    </>

  )
}

export default Error