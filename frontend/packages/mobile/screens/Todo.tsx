import MaterialIcon from '@expo/vector-icons/MaterialIcons'
import { TaskType } from '@todo/client-core/src/types/todoTypes'
import React, { useEffect } from 'react'
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { useDispatch } from 'react-redux'
import { COMPLETE_TASK, DELETE_TASK, GET_TASKS } from '../actions/actionsNames'
import { globalStyles } from '../styles/commonStyles'

const Todo: React.FC<{ id: string, currentTasks: TaskType[] | [] }> = ({ id, currentTasks }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<{ type: typeof GET_TASKS.CALL, userId: string }>({ type: GET_TASKS.CALL, userId: id })
  }, [])


  const handleRender: ListRenderItem<TaskType> = ({ item }) => {
    const { completed, _id } = item;

    const handleDelete = () => {
      dispatch<{ type: typeof DELETE_TASK.CALL, id?: string }>({ type: DELETE_TASK.CALL, id: _id })
    }

    const handleComplete = () => {
      dispatch<{ type: typeof COMPLETE_TASK.CALL, id?: string }>({ type: COMPLETE_TASK.CALL, id: _id })
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          backgroundColor: 'yellow'
        }}
      >
        <BouncyCheckbox
          style={{
            ...globalStyles.checkBoxIcon,
            borderTopWidth: 1,
            borderTopColor: 'black'
          }}
          fillColor={'black'}
          onPress={handleComplete}
          isChecked={completed ? true : false}
        />
        <Text
          style={{
            ...globalStyles.input,
            borderTopWidth: 1,
            borderTopColor: 'red'
          }}
        >
          {item.description}
        </Text>
        <MaterialIcon
          style={{
            alignSelf: 'center'
          }}
          name='delete'
          size={20}
          onPress={handleDelete} />
      </View>
    )
  }

  return (
    <>
      <View>
        <FlatList
          data={currentTasks}
          renderItem={handleRender}
          style={{ backgroundColor: 'green' }}
        />
      </View>

    </>
  )
}

export default Todo;
