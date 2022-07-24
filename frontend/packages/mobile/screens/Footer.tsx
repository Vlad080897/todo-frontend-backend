import { getTasksSelector } from '@todo/client-core/src/selectors/todoSelectors'
import { getUserSelector } from '@todo/client-core/src/selectors/userSelectors';
import { Dispatch, SetStateAction } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { CLEAR_TASKS } from '../actions/actionsNames';

const Footer: React.FC<IFooterProps> = ({ setPath }) => {
  const dispatch = useDispatch();

  const { id } = useSelector(getUserSelector)!;
  const itemsLeft = useSelector(getTasksSelector).filter(t => t.completed !== true).length;
  const haveCompleted = useSelector(getTasksSelector).filter(t => t.completed === true).length;

  const handleClear = () => {
    dispatch<{ type: typeof CLEAR_TASKS.CALL, userId: string }>({ type: CLEAR_TASKS.CALL, userId: id });
  }

  return (
    <View style={styles.footer}>
      <Text>{`${itemsLeft} left`}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title='All' onPress={() => setPath('all')} />
        <Button title='Active' onPress={() => setPath('active')} />
        <Button title='Compl' onPress={() => setPath('completed')} />
      </View>
      {haveCompleted ? <Button title='Clear' onPress={handleClear} /> : null}
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
  },

})

interface IFooterProps {
  setPath: Dispatch<SetStateAction<"completed" | "all" | "active">>
}