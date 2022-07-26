import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeAxiosInstance } from '@todo/client-core/src/api/api';
import CommonStore from "@todo/client-core/src/commonStore/commonStore";
import { store } from '@todo/client-core/src/redux/store';
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import AppRoot from "./screens/AppRoot";

CommonStore.setStore({
  getItem: async (key: string) => await AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key)
});
debugger
changeAxiosInstance("http://10.0.2.2:8000")

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
