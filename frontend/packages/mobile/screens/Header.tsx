import { GET_TASKS, GET_USER } from '@todo/client-core/src/actions/actionsNames';
import { getLoadingSelector, getTasksSelector } from '@todo/client-core/src/selectors/todoSelectors';
import { getUserSelector } from '@todo/client-core/src/selectors/userSelectors';
import { TaskType } from '@todo/client-core/src/types/todoTypes';
import { Formik } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TASK } from '../actions/actionsNames';
import { globalStyles } from "../styles/commonStyles";

const Header: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useDispatch();
  const [checkAllBtnState, setCheckAllBtnState] = useState(false)

  const tasks = useSelector(getTasksSelector);
  const haveNotCompleted = useMemo(() => tasks.find(t => t.completed === false), [tasks]);
  const loading = useSelector(getLoadingSelector);

  useEffect(() => {
    const isAllChecked = () => {
      if (haveNotCompleted) {
        setCheckAllBtnState(false);
      }
      if (!haveNotCompleted && tasks.length) {
        const fromLocal = tasks.find(t => t.completed === false);
        if (fromLocal) {
          setCheckAllBtnState(false);
          return;
        };
        setCheckAllBtnState(true);
        return;
      };
      setCheckAllBtnState(false);
    }
    isAllChecked();
  }, [tasks, haveNotCompleted])

  return (
    <Formik
      initialValues={{ desc: '' }}
      onSubmit={(values, actions) => {
        const newTask: TaskType = {
          description: values.desc,
          isEdit: false,
          completed: false,
          userId: id
        };
        dispatch<{ type: typeof ADD_TASK.CALL, newTask: TaskType }>({ type: ADD_TASK.CALL, newTask });
        actions.resetForm();
      }}
    >
      {({ values, handleChange, handleSubmit, handleBlur }) => (
        <>
          <Text style={styles.headerTitle}>todos</Text>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            {loading ? <Text>...</Text> : <BouncyCheckbox
              style={globalStyles.checkBoxIcon}
              fillColor={'black'}
              isChecked={checkAllBtnState}
              disableBuiltInState
            />}
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
