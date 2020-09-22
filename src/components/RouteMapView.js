//Import React and Hook we needed
import React, { useState, useEffect } from "react";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
//Import all required component
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import haversine from "haversine";

const RouteMapView = ({ navigation }) => {
  const LATITUDE_DELTA = 0.009;
  const LONGITUDE_DELTA = 0.009;
  const LATITUDE = 11.084164699999999;
  const LONGITUDE = 76.9857916;

  let [tripId, setTripId] = useState("");
  let [location, setLocation] = useState({});
  let [latitude, setLatitude] = useState(0);
  let [longitude, setLongitude] = useState(0);
  let [routeCoordinates, setRouteCoordinates] = useState([]);
  let [distanceTravelled, setDistanceTravelled] = useState(0);
  let [prevLatLng, setPrevLatLng] = useState({});
  let [coordinate, setCoordinate] = useState(
    new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  );

  let watchID = null;

  async function getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      return location;
    } else {
      throw new Error("Location permission not granted");
    }
  }

  async function sendLocDetails(locData) {
    try {
      console.log(locData);
      let response = await fetch("http://13.126.228.168:3000/db/locDetails", {
        method: "POST",
        body: JSON.stringify(locData),
        headers: { "Content-Type": "application/json" },
      });
      let responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  useEffect(() => {
    let location = getLocationAsync();
    setLocation(location);
    setTripId(navigation.getParam("tripId", ""));
    console.log(JSON.stringify(location));
    watchID = navigator.geolocation.watchPosition(
      (position) => {
        //   const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;
        const newCoordinate = {
          latitude,
          longitude,
        };

        console.log(newCoordinate);
        coordinate.timing(newCoordinate).start();
        setLatitude(latitude);
        setLongitude(longitude);
        setRouteCoordinates(routeCoordinates.concat([newCoordinate]));
        setDistanceTravelled(
          distanceTravelled + this.calcDistance(newCoordinate)
        );
        setPrevLatLng(newCoordinate);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    );
    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  }, [
    coordinate,
    latitude,
    longitude,
    routeCoordinates,
    distanceTravelled,
    prevLatLng,
  ]);

  getMapRegion = () => ({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  calcDistance = (newLatLng) => {
    //   const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  const handleFinishButton = async () => {
    const newLocDtl = {
      tripId: tripId,
      prevLatLng: prevLatLng,
      distanceTravelled: distanceTravelled,
      routeCoordinates: routeCoordinates,
    };
    let resp = await sendLocDetails(newLocDtl);
    /*     let respJson = await resp.json(); */
    navigation.navigate("PickupScreen");
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={this.getMapRegion()}
      >
        <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        <Marker.Animated
          ref={(marker) => {
            this.marker = marker;
          }}
          coordinate={coordinate}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.bubble, styles.button]}>
          <Text style={styles.bottomBarContent}>
            {parseFloat(distanceTravelled).toFixed(2)} km
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleFinishButton}
          style={[styles.bubble, styles.button]}
        >
          <Text>FinishTrip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default RouteMapView;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});
