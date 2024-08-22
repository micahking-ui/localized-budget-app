import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  ToastAndroid,
  Animated,
} from "react-native";
import { supabase } from "../lib/supabase-client";
import { Link, useRouter } from "expo-router";
import Colors from "../../utils/Colors";
import { Ionicons } from "react-native-vector-icons";
import { getUserData, storeUserData } from "../../utils/services";
import { TranslationContext } from "../../contexts/translationContext";

export default function Auth() {
  const { translations } = useContext(TranslationContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [slideAnim, setSlideAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert(
        translations.errors?.loginError,
        translations.errors?.invalidCredentials,
        [
          {
            text: translations.common?.ok, // Custom text for the button
            onPress: () => console.log("OK Pressed"),
            style: "default", // You can use "default", "cancel", or "destructive"
          },
        ],
        { cancelable: false } // Prevents the alert from being dismissed by tapping outside
      );
      ToastAndroid.show(
        translations.errors?.checkLoginDetails,
        ToastAndroid.TOP
      );
    } else {
      // Login successful, store user data
      await storeUserData(user);
      await getUserData();
      ToastAndroid.show("Login Successful!", ToastAndroid.SHORT);
      // Navigate to home screen or perform other actions
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BLACK, paddingTop: 20 }}>
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={{ padding: 10 }}
      >
        <Ionicons name="arrow-back-circle" size={44} color="white" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require("../../assets/user.png")}
            style={{
              width: 90,
              height: 90,
              borderRadius: 99,
              alignSelf: "center",
              elevation: 30,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: "poppins-bold",
              color: "#333",
              marginTop: 20,
              paddingHorizontal: 18,
              textAlign: "center",
            }}
          >
            {translations.details?.welcome}
          </Text>

          <View style={[styles.verticallySpaced, styles.mt20]}>
            <TextInput
              style={styles.textInput}
              label="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder={translations.details?.placeholder}
              autoCapitalize={"none"}
            />
          </View>
          <View style={[styles.verticallySpaced]}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              label="Password"
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
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: "#00698f",
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
                onPress={signInWithEmail}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.WHITE} size="large" />
                ) : (
                  <Text style={styles.ButtonText}>
                    {translations.details?.login}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.verticallySpaced}>
            <View style={{ alignItems: "center", marginTop: 15 }}>
              <TouchableOpacity
                style={{ display: "flex", flexDirection: "row" }}
              >
                <Text
                  style={{
                    fontFamily: "poppins",
                  }}
                >
                  {translations.details?.noaccount}
                </Text>
                <Link href={"/(auth)/signup"}>
                  <Text
                    style={{
                      color: Colors.EYES,
                      fontFamily: "poppins",
                    }}
                  >
                    {translations.details?.signup}
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

const styles = StyleSheet.create({
  ButtonContainer: {
    backgroundColor: Colors.BLACK,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 25,
    marginLeft: 8,
    elevation: 10,
    marginTop: 10,
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
    marginTop: 90,
    padding: 15,
    justifyContent: "center",
    elevation: 1,
    marginHorizontal: 10,
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
    padding: 12,
    margin: 8,
    fontFamily: "poppins",
    fontSize: 16,
  },
});
