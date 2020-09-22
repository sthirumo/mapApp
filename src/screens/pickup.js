//Import React and Hook we needed
import React, { useState } from "react";

//Import all required component
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const PickupScreen = (props) => {
  let [customerName, setCustomerName] = useState("");
  let [customerNumber, setCustomerNumber] = useState("");
  let [vehModel, setVehModel] = useState("");
  let [vehNumber, setVehNumber] = useState("");
  let [loading, setLoading] = useState(false);
  let [tripId, setTripId] = useState("");
  let [errortext, setErrortext] = useState("");
  let [isPickupSuccess, setIsPickupSuccess] = useState(false);

  async function registerPickUp(data) {
    let formBody = [];
    let responseJson = {};
    try {
      for (var key in data) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(data[key]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      let response = await fetch("http://13.126.228.168:3000/db/register", {
        method: "POST",
        body: formBody,
        headers: {
          //Header Defination
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });
      responseJson = await response.json();
      setTripId(responseJson.tripId);
      responseJson["respSuccess"] = true;
    } catch (err) {
      console.log(err);
      responseJson["respSuccess"] = false;
    }
    return responseJson;
  }

  const handleSubmitButton = async () => {
    try {
      setErrortext("");
      if (!customerName) {
        alert("Please fill Customer Name");
        return;
      }
      if (!customerNumber) {
        alert("Please fill Customer Phone Number");
        return;
      }
      if (!vehModel) {
        alert("Please fill Vehicle Model");
        return;
      }
      if (!vehNumber) {
        alert("Please fill Vehicle Number");
        return;
      }
      //Show Loader
      //setLoading(true);
      var dataToSend = {
        cust_name: customerName,
        cust_phone: customerNumber,
        veh_model: vehModel,
        veh_number: vehNumber,
      };
      console.log("call api....");
      let registerResp = await registerPickUp(dataToSend);
      console.log("end call api....");
      setLoading(false);
      // If server response message same as Data Matched
      if (registerResp.respSuccess) {
        console.log(isPickupSuccess);
        setIsPickupSuccess(true);
        console.log("Registration Successful. Please Login to proceed");
      } else {
        setErrortext("Registration Unsuccessful");
      }
      console.log("check success....");
      console.log(isPickupSuccess);
    } catch (err) {}
  };

  if (isPickupSuccess) {
    console.log("inside the success loop");
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../assets/success.png")}
          style={{
            height: 150,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <Text style={styles.successTextStyle}>Trip Start Successful.</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => {
            setIsPickupSuccess(false);
            props.navigation.navigate("MapScreen", {
              tripId: tripId,
            });
          }}
        >
          <Text style={styles.buttonTextStyle}>View Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(CustomerName) => setCustomerName(CustomerName)}
              placeholder="Enter Customer Name"
              placeholderTextColor="#fb5b5a"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                this._phnumberinput && this._phnumberinput.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(CustNumber) => setCustomerNumber(CustNumber)}
              placeholder="Enter Customer Phone Number"
              placeholderTextColor="#fb5b5a"
              keyboardType="numeric"
              ref={(ref) => {
                this._phnumberinput = ref;
              }}
              returnKeyType="next"
              onSubmitEditing={() =>
                this._vehmodelinput && this._vehmodelinput.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(VehModel) => setVehModel(VehModel)}
              placeholder="Enter Vehicle Model"
              placeholderTextColor="#fb5b5a"
              autoCapitalize="sentences"
              ref={(ref) => {
                this._vehmodelinput = ref;
              }}
              onSubmitEditing={() =>
                this._vehnuminput && this._vehnuminput.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(VehNumber) => setVehNumber(VehNumber)}
              placeholder="Enter Vehicle Number"
              placeholderTextColor="#fb5b5a"
              keyboardType="numeric"
              ref={(ref) => {
                this._vehnuminput = ref;
              }}
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          {errortext != "" ? (
            <Text style={styles.errorTextStyle}> {errortext} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}
          >
            <Text style={styles.buttonTextStyle}>Start Pickup</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default PickupScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    backgroundColor: "#f6d3d3",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 30,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#fb5b5a",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "red",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,

    borderColor: "white",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "green",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
});
