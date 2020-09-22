//Import React and Hooks we needed
import React, { useState, useEffect } from "react";

//Import all required component
import { ActivityIndicator, View, StyleSheet, Image } from "react-native";
// import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = (props) => {
  //State for ActivityIndicator animation
  let [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      props.navigation.navigate("StackRoute");

      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      /*  AsyncStorage.getItem('user_id').then(value =>
        props.navigation.navigate(
          value === null ? 'Auth' : 'DrawerNavigationRoutes'
        )
      ); */
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: "90%", resizeMode: "contain", margin: 30 }}
      />
      <ActivityIndicator
        animating={animating}
        color="#fb5b5a"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});
