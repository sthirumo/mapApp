import React from "react";

import { createAppContainer, createSwitchNavigator } from "react-navigation";

//Import all the screens needed
import SplashScreen from "./src/screens/splash";
import StackRoute from "./src/screens/stackRoute";

/* Switch Navigator for those screens which needs to be switched only once
  and we don't want to switch back once we switch from them to the next one */
const App = createSwitchNavigator({
  SplashScreen: {
    /* SplashScreen which will come once for 5 Seconds */
    screen: SplashScreen,
    navigationOptions: {
      /* Hiding header for Splash Screen */
      headerShown: false,
    },
  },
  StackRoute: {
    /* Auth Navigator which includer Login Signup will come once */
    screen: StackRoute,
  },
});

export default createAppContainer(App);
