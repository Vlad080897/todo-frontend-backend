import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system';
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Socket } from 'socket.io-client';
import { LOG_OUT } from "@todo/client-core/src/actions/actionsNames";
import { getUserSelector } from "@todo/client-core/src/selectors/userSelectors";

const UserInfo: React.FC<{ socket: Socket | null }> = ({ socket }) => {
  const dispatch = useDispatch();
  const user = useSelector(getUserSelector);
  const handleLogOut = useCallback(() => {
    dispatch({ type: LOG_OUT.CALL })
    socket?.emit('leave', { userId: user?.id })
    socket?.off('add-new-task');
  }, [socket, user?.id, dispatch])
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