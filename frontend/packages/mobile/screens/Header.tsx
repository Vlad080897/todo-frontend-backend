import { GET_TASKS } from '@todo/client-core/src/actions/actionsNames';
import { TaskType } from '@todo/client-core/src/types/todoTypes';
import { Formik } from 'formik';
import { StyleSheet, Text, TextInput, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch } from 'react-redux';
import { globalStyles } from "../styles/commonStyles";

const Header = () => {

  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ desc: '' }}
      onSubmit={(values) => {
        const newTask: TaskType = {
          description: values.desc,
          isEdit: false,
          completed: false,
          userId: "62c956a66084268805792343"
        };
        // fetch("http://192.168.1.89:8000/api/todos/62c956a66084268805792343")
        //   .then(res => {
        //     return res.json()
        //   })
        //   .then(data => console.log(data))
        dispatch({ type: GET_TASKS.CALL, userId: "62c956a66084268805792343" })
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
