import React from "react";
import { SafeAreaView } from "react-navigation";
import { Text, StyleSheet } from "react-native";
import Maptrack from "../components/RouteMapView";

const MapScreen = (props) => {
  return <Maptrack navigation={props.navigation} />;
};

export default MapScreen;
