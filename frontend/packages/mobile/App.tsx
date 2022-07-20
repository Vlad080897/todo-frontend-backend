import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import Footer from "./screens/Footer";
import Header from "./screens/Header";
import Todo from "./screens/Todo";
import { store } from '@todo/client-core/src/redux/store'

const App = () => {
  const [loaded] = useFonts({
    sansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
    sansReg: require("./assets/fonts/OpenSans-Regular.ttf"),
  });

  if (!loaded) return null;
  
  return (
    <Provider store={store}>
      <View style={styles.todoapp}>
        <Header />
        <Todo />
        <Footer />
      </View>
    </Provider>
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
