import { Formik } from "formik";
import { StyleSheet, Button, TextInput, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { globalStyles } from "../styles/commonStyles";

const Header = () => {
  return (
    <View>
      <Button title="Submit" />
    </View>
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
