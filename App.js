import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigation/MainNavigator";
import { GlobalProvider } from "./context/GlobalContext";
import { LogBox } from "react-native";
// import { NativeModules, NativeEventEmitter } from "react-native";

// const { TapjoyModule } = NativeModules;
// const TapjoyModuleEvt = new NativeEventEmitter(TapjoyModule);

export default function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </GlobalProvider>
  );
}
