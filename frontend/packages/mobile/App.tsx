import { StyleSheet, Text, View } from "react-native";
import Header from "./screens/Header";
import { useFonts } from "expo-font";
import Todo from "./screens/Todo";
import Footer from "./screens/Footer";
import { GET_TASKS } from "@todo/client-core/src/actions/actionsNames";
import { registerRootComponent } from "expo";

const App = () => {
  const [loaded] = useFonts({
    sansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
    sansReg: require("./assets/fonts/OpenSans-Regular.ttf"),
  });

  console.log("GET_TASKS", GET_TASKS);

  if (!loaded) return null;

  return (
    <View style={styles.todoapp}>
      <Text>HELLO</Text>
      {/* <Header />
        <Todo />
        <Footer /> */}
    </View>
  );
};

export default registerRootComponent(App);

const styles = StyleSheet.create({
  todoapp: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
});
