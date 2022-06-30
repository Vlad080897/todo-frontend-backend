import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LOG_OUT } from '../actions/actionsNames';
import { getUserSelector } from '../selectors/userSelectors';

const UserInfo = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserSelector);
  const handleLogOut = () => {
    dispatch({ type: LOG_OUT.CALL })
  }
  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography>{user?.email}</Typography>
        <Button type='button' onClick={handleLogOut} variant='contained'>Logout</Button>
      </Box>
    </>
  )
}

export default UserInfo