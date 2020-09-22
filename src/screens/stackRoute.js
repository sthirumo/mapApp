import React from "react";

import { createStackNavigator } from "react-navigation-stack";

//Import all the screens needed
import LoginScreen from "./login";
import PickupScreen from "./pickup";
import MapScreen from "./MapScreen";

const StackRoute = createStackNavigator({
  //Stack Navigator for Login and Sign up Screen

  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  PickupScreen: {
    screen: PickupScreen,
    navigationOptions: {
      title: "PickUp",
      headerStyle: {
        backgroundColor: "#fb5b5a",
      },
      headerTintColor: "#fff",
    },
  },
  MapScreen: {
    screen: MapScreen,
    navigationOptions: {
      title: "Route Track",
      headerStyle: {
        backgroundColor: "#fb5b5a",
      },
      headerTintColor: "#fff",
    },
  },
});

export default StackRoute;
