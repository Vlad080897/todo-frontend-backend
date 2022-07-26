import MaterialIcon from '@expo/vector-icons/MaterialIcons'
import { Box, TextInput } from '@react-native-material/core'
import { COMPLETE_TASK, DELETE_TASK, GET_TASKS, TOGGLE, UPDATE } from '@todo/client-core/src/actions/actionsNames'
import { getError } from '@todo/client-core/src/selectors/todoSelectors'
import { TaskType } from '@todo/client-core/src/types/todoTypes'
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { globalStyles } from '../styles/commonStyles'

const Todo: React.FC<{ id: string, currentTasks: TaskType[] | [] }> = ({ id, currentTasks }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<{ type: typeof GET_TASKS.CALL, userId: string }>({ type: GET_TASKS.CALL, userId: id })
  }, [])

  const handleRender: ListRenderItem<TaskType> = ({ item }) => {
    const { completed, _id, isEdit, description } = item;

    const handleDelete = () => {
      dispatch<{ type: typeof DELETE_TASK.CALL, id?: string }>({ type: DELETE_TASK.CALL, id: _id });
    };

    const handleComplete = () => {
      dispatch<{ type: typeof COMPLETE_TASK.CALL, id?: string }>({ type: COMPLETE_TASK.CALL, id: _id });
    };

    const handleEdit = () => {
      dispatch<{ type: typeof TOGGLE.CALL, id?: string, isEdit: boolean, description: string }>
        ({ type: TOGGLE.CALL, id: _id, description, isEdit });
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
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
          disableBuiltInState
          TouchableComponent={Pressable}
        />
        {isEdit ?
          <Formik
            initialValues={{
              edit: description
            }}
            onSubmit={({ edit }) => {
              dispatch<{ type: typeof UPDATE.CALL, id?: string, description: string, isEdit: boolean }>
                ({ type: UPDATE.CALL, id: _id, description: edit, isEdit })
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <TextInput
                style={styles.editInput}
                value={values.edit}
                onChangeText={handleChange('edit')}
                onSubmitEditing={() => handleSubmit()}
                variant='outlined'
                trailing={
                  <TouchableOpacity>
                    <MaterialIcon name='check' size={20} onPress={() => handleSubmit()} />
                  </TouchableOpacity>
                }
              />
            )}
          </Formik>
          : <Text
            style={styles.description}
            onLongPress={handleEdit}
          >
            {description}
          </Text>}
        <Box style={styles.deleteBox}>
          {isEdit ? <Box style={{ padding: 10 }} /> : <MaterialIcon
            style={{ position: 'relative', right: 10 }}
            name='delete'
            size={20}
            onPress={handleDelete}
          />}
        </Box>
      </View >
    )
  }

  return (
    <>
      <View>
        
        <FlatList
          data={currentTasks}
          renderItem={handleRender}
        />
      </View>

    </>
  )
}

export default Todo;

const styles = StyleSheet.create({
  editInput: {
    ...globalStyles.input,
    width: '75%',
    borderTopWidth: 1,
    borderTopColor: 'black'
  },
  deleteBox: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: 'black'
  },
  description: {
    ...globalStyles.input,
    borderTopWidth: 1,
    borderTopColor: 'black',
    width: '75%'
  }
})
