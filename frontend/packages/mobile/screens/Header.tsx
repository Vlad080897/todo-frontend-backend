import { GET_TASKS, GET_USER } from '@todo/client-core/src/actions/actionsNames';
import { getUserSelector } from '@todo/client-core/src/selectors/userSelectors';
import { TaskType } from '@todo/client-core/src/types/todoTypes';
import { Formik } from 'formik';
import { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TASK } from '../actions/actionsNames';
import { globalStyles } from "../styles/commonStyles";

const Header = () => {
  const user = useSelector(getUserSelector);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({ type: GET_USER.CALL })
  // }, [])

  return (
    <Formik
      initialValues={{ desc: '' }}
      onSubmit={(values) => {
        const newTask: TaskType = {
          description: values.desc,
          isEdit: false,
          completed: false,
          userId: user?.id!
        };
        dispatch<{ type: `ADD_TASK_CALL`, newTask: TaskType }>({ type: ADD_TASK.CALL, newTask })
      }}
    >
      {({ values, handleChange, handleSubmit, handleBlur }) => (
        <>
          <Text style={styles.headerTitle}>todos</Text>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <BouncyCheckbox
              style={globalStyles.checkBoxIcon}
              fillColor={'black'}
            />
            <TextInput
              value={values.desc}
              style={globalStyles.input}
              onChangeText={handleChange('desc')}
              onBlur={handleBlur('desc')}
              onSubmitEditing={() => handleSubmit()}
              placeholder='Add your todo here'
            />
          </View>
        </>
      )}
    </Formik >
  );
};

export default Header;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 60,
    fontWeight: "400",
    textAlign: "center",
    color: "rgba(175, 47, 47, 0.15)",
  },
});
