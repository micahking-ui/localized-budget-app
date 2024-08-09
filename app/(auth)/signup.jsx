import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase-client";
import { Link, useRouter } from "expo-router";
import Colors from "../../utils/Colors";
import { Ionicons } from "react-native-vector-icons";
import { Image } from "react-native";
import { TranslationContext } from "../../contexts/translationContext";
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.

export default function SignUpAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { translations } = useContext(TranslationContext);
  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Sign Up Error", error.message);
      ToastAndroid.show("Please supply your details!", ToastAndroid.TOP);
    } else {
      router.replace("/(auth)/login");
      ToastAndroid.show("Sign Up Successful!", ToastAndroid.SHORT);
    }

    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BLACK, paddingTop: 20 }}>
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
            {translations.details?.welcome2}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "444444",
              marginTop: 5,
              textAlign: "center",
              paddingHorizontal: 20,
              fontFamily: "poppins",
            }}
          >
            You're now part of our community. Start exploring and make the most
            out of it!
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
          <View
            style={[
              styles.verticallySpaced,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={showPassword ? false : true}
              placeholder={translations.details?.password}
              autoCapitalize={"none"}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                alignSelf: "center",
                padding: 15,
                backgroundColor: Colors.EYES,
                borderRadius: 15,
                marginRight: 8,
              }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={Colors.GRAY}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <View style={styles.ButtonContainer}>
              <TouchableOpacity disabled={loading} onPress={signUpWithEmail}>
                {loading ? (
                  <ActivityIndicator color={Colors.WHITE} size="large" />
                ) : (
                  <Text style={styles.ButtonText}>
                    {translations.details?.signup}
                  </Text>
                )}
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

const styles = StyleSheet.create({
  ButtonContainer: {
    backgroundColor: Colors.BLACK,
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
    marginTop: 120,
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
    padding: 12,
    margin: 8,
    fontFamily: "poppins",
    fontSize: 16,
  },
});
