import { Button } from '@react-native-material/core';
import { CLEAR_TASKS } from '@todo/client-core/src/actions/actionsNames';
import { getAllTasksLength, getTasksSelector } from '@todo/client-core/src/selectors/todoSelectors'
import { getLoading, getUserSelector } from '@todo/client-core/src/selectors/userSelectors';
import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const Footer: React.FC<IFooterProps> = ({ setPath, path }) => {
  const dispatch = useDispatch();

  const { id } = useSelector(getUserSelector)!;
  const itemsLeft = useSelector(getTasksSelector).filter(t => t.completed !== true).length;
  const haveCompleted = useSelector(getTasksSelector).filter(t => t.completed === true).length;
  const haveTasks = useSelector(getAllTasksLength);

  const handleClear = () => {
    dispatch<{ type: typeof CLEAR_TASKS.CALL, userId: string }>({ type: CLEAR_TASKS.CALL, userId: id });
  }

  return (
    <>
      {haveTasks ? <View style={styles.footer}>
        <Text style={{ color: 'white' }}>{`${itemsLeft} left`}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Button
            color={`${path === 'all' ? 'blue' : 'white'}`}
            style={{ padding: 0 }}
            variant='text'
            title='All'
            onPress={() => setPath('all')} />
          <Button
            color={`${path === 'active' ? 'blue' : 'white'}`}
            variant='text'
            title='Active'
            onPress={() => setPath('active')} />
          <Button
            color={`${path === 'completed' ? 'blue' : 'white'}`}
            variant='text'
            title='Compl'
            onPress={() => setPath('completed')} />
        </View>
        {haveCompleted ? <Button color='white' variant='text' title='Clear' onPress={handleClear} /> : null}
      </View> : null}
    </>
  )
}

export default Footer

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 5,
    height: 40,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

})

interface IFooterProps {
  setPath: Dispatch<SetStateAction<"completed" | "all" | "active">>,
  path: "completed" | "all" | "active"
}