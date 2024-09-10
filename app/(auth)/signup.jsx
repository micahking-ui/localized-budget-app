import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";

import { supabase } from "../lib/supabase-client";
import { Link, useRouter } from "expo-router";
import Colors from "../../utils/Colors";
import { Ionicons } from "react-native-vector-icons";
import { Image } from "react-native";
import { TranslationContext } from "../../contexts/translationContext";

import NetInfo from "@react-native-community/netinfo";
export default function SignUpAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { translations } = useContext(TranslationContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  //network access
  let isConnected = true;
  NetInfo.addEventListener((state) => {
    isConnected = state.isConnected;
  });
  //signup function
  async function signUpWithEmail() {
    //if network access fail
    if (!isConnected) {
      Alert.alert(
        translations.errors?.networkerror,
        translations.errors?.requestfail,
        [
          {
            text: translations.common?.ok,
            onPress: () => console.log("OK Pressed"),
            style: "default",
          },
        ],
        { cancelable: false }
      );
      return;
    }
// signup error handler 

// email format error catching
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      Alert.alert(
        translations.errors?.signupError,
        translations.errors?.invalidEmail
      );
      return;
    }
    try {
      //sign uo function
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
// email length
      if (password.length < 6) {
        Alert.alert(translations.errors?.signupError, translations.errors?.length);
        return;
      }
      //if user already exist
      else if (error) {
        if (email || password) {
          Alert.alert(translations.errors?.signupError, translations.errors?.register);
          return;
        }
      }
      //new user redirect to login screen
      else {
        router.replace("/(auth)/login");
        ToastAndroid.show(translations.errors?.success, ToastAndroid.SHORT);
      }
      } catch (error) {
        Alert.alert(translations.errors?.signupError, translations.errors?.details);
        ToastAndroid.show(translations.errors?.details, ToastAndroid.TOP);
      }
  }
  //user interface
  return (
    <View style={{ flex: 1, backgroundColor: Colors.PRIMARY, paddingTop: 20 }}>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={{ padding: 10 }}
      >
        <Ionicons name="arrow-back-circle" size={44} color="white" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require("../../assets/user.png")}
            style={styles.imgSign}
          />
          <Text style={styles.signWelcome}>
            {translations.details?.welcome2}
          </Text>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <TextInput
              style={styles.textInput}
              label="First Name"
              onChangeText={(text) => setFirstName(text)}
              value={firstName}
              placeholder={translations.details?.firstname}
              autoCapitalize={"words"}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              style={styles.textInput}
              label="Last Name"
              onChangeText={(text) => setLastName(text)}
              value={lastName}
              placeholder={translations.details?.lastname}
              autoCapitalize={"words"}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              style={styles.textInput}
              label="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder={translations.details?.placeholder}
              autoCapitalize={"none"}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={showPassword ? false : true}
              placeholder={translations.details?.password}
              autoCapitalize={"none"}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showpassword}
              >
                {showPassword ? (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: "#00698f",
                    }}
                  />
                ) : null}
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "poppins-medium",
                  color: "#00698f",
                  marginLeft: 12,
                }}
              >
                {showPassword
                  ? translations.details?.hide
                  : translations.details?.show}
              </Text>
            </View>
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <View style={styles.ButtonContainer}>
              <TouchableOpacity
                disabled={!email || !password}
                onPress={signUpWithEmail}
              >
                <Text style={styles.ButtonText}>
                  {translations.details?.signup}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.verticallySpaced}>
            <View style={{ alignItems: "center", marginTop: 8 }}>
              <TouchableOpacity
                style={{ display: "flex", flexDirection: "row" }}
              >
                <Text
                  style={{
                    fontFamily: "poppins",
                  }}
                >
                  {translations.details?.account}
                </Text>
                <Link href={"/(auth)/login"}>
                  <Text
                    style={{
                      color: Colors.EYES,
                      fontFamily: "poppins",
                      marginLeft: 4,
                    }}
                  >
                    {translations.details?.login}
                  </Text>
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
//styling
const styles = StyleSheet.create({
  ButtonContainer: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 25,
    marginLeft: 8,
    elevation: 10,
  },
  ButtonText: {
    padding: 5,
    fontSize: 16,
    color: "white",
    fontFamily: "poppins-bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  container: {
    marginTop: 20,
    padding: 12,
    justifyContent: "center",
    elevation: 1,
    marginHorizontal: 8,
    borderRadius: 30,
    backgroundColor: "white",
  },
  verticallySpaced: {
    paddingTop: 1,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 12,
  },
  textInput: {
    borderColor: "#000965",
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    padding: 8,
    margin: 8,
    fontFamily: "poppins",
    fontSize: 16,
  },
  imgSign: {
    width: 90,
    height: 90,
    borderRadius: 99,
    alignSelf: "center",
    elevation: 30,
  },
  signWelcome: {
    fontSize: 20,
    fontFamily: "poppins-bold",
    color: "#333",
    marginTop: 20,
    paddingHorizontal: 18,
    textAlign: "center",
  },
  showpassword: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#00698f",
    justifyContent: "center",
    alignItems: "center",
  },
});
