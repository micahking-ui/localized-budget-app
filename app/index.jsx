import { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "./lib/supabase-client";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Colors from "../utils/Colors";
import { TranslationContext } from "../contexts/translationContext";

export default function HomePage() {
  const { translations, handleLanguageChange } = useContext(TranslationContext);

  const router = useRouter();

  useEffect(() => {
    handleGetStarted();
  }, []);

  const handleGetStarted = async () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)/home/");
      } else {
        console.log("no user");
      }
    });
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignSelf: "stretch",
          marginTop: 30,
          paddingHorizontal: 10,
          paddingTop: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => handleLanguageChange("hausa")}
          style={styles.selectionButton}
        >
          <Text
            style={{
              color: Colors.BLACK,
              fontFamily: "poppins-medium",
              fontSize: 18,
            }}
          >
            Hausa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLanguageChange("english")}
          style={styles.selectionButton}
        >
          <Text
            style={{
              color: Colors.BLACK,
              fontFamily: "poppins-medium",
              fontSize: 18,
            }}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require("../assets/splash.png")}
        style={styles.welcomeImg}
      />
      <View style={styles.bgBottom}>
        <Text style={styles.heading2}>Kasafin Kudi </Text>
        <Text style={styles.paragraph}>
          <Text>{translations.intro?.welcome}</Text>
          <Text style={styles.heading}> NaijaBudget</Text> 
         <Text>{translations.intro?.welcome1}</Text> 
        </Text>
        <View style={styles.buttonCon}>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            style={styles.button}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                fontFamily: "poppins-bold",
                color: Colors.BLACK,
              }}
            >
              {translations.intro?.getstarted}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  selectionButton: {
    marginRight: 5,
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    elevation: 4,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 99,
    elevation:10
  },

  heading: {
    fontSize: 15,
    marginTop: -15,
    fontFamily: "poppins-bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.WHITE,
  },
  heading2: {
    fontSize: 35,
    fontFamily: "poppins-bold",
    textAlign: "center",
    color: Colors.WHITE,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: "poppins",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.WHITE,
  },
  getstarted: {
    backgroundColor: "#4caf50",
    color: "#ffffff",
    padding: 10,
    paddingHorizontal: 20,
    fontSize: 18,
   
  },
  welcomeImg: {
    marginTop: 4,
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  bgBottom: {
    backgroundColor: Colors.BLACK,
    height: 300,
    marginTop: 20,
    padding: 20,borderRadius:20,
    marginHorizontal:6
  },
  buttonCon: {
    padding: 1,
    
  },
});
