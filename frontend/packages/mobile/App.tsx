import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import Footer from "./screens/Footer";
import Header from "./screens/Header";
import Todo from "./screens/Todo";
import { store } from '@todo/client-core/src/redux/store'
import { useEffect } from "react";
import { GET_TASKS } from "./actions/actionsNames";
import Login from "./screens/Login";
import { getUserSelector } from "@todo/client-core/src/selectors/userSelectors";
import AppRoot from "./screens/AppRoot";
import CommonStore from "@todo/client-core/src/commonStore/commonStore";
import AsyncStorage from '@react-native-async-storage/async-storage'

CommonStore.setStore({
  getItem: async (key: string) => await AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key)
})

const App = () => {
  const [loaded] = useFonts({
    sansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
    sansReg: require("./assets/fonts/OpenSans-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <AppRoot />
    </Provider>
  );
};

export default registerRootComponent(App);

const styles = StyleSheet.create({

});
