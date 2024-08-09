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
        backgroundColor:Colors.WHITE
       
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignSelf: "flex-start",
          marginTop:30,
          paddingHorizontal:10,
          paddingTop:5
        }}
      >
        <TouchableOpacity
          onPress={() => handleLanguageChange("hausa")}
          style={styles.selectionButton}
        >
          <Text style={{ color: Colors.BLACK, fontFamily: "poppins-medium", fontSize:18 }}>
            Hausa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLanguageChange("english")}
          style={styles.selectionButton}
        >
          <Text style={{ color: Colors.BLACK, fontFamily: "poppins-medium", fontSize:18 }}>
            English
          </Text>
        </TouchableOpacity>
      </View>
  <Image source={require('../assets/bimage.png')} style={styles.welcomeImg}/>
      <View style={styles.bgBottom}>
        <Text style={styles.heading}>Personal Budget Planner</Text>
        <Text style={styles.paragraph}>Stay on Track, Event by Event: Your Personal Budget Planner App!</Text>
    
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}style={styles.button}>
            <Text style={{textAlign:'center', fontSize:18, fontFamily:'poppins-bold', color:Colors.BLACK}} >Get Started</Text>
          </TouchableOpacity>
        
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  selectionButton:{
    marginRight: 5,
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderRadius: 5,
  },
  button: {
    padding: 15,
    backgroundColor:Colors.WHITE,
    borderRadius:99,
    paddingHorizontal:5,
   
  },
 
  heading: {
    fontSize: 35,
    fontFamily: "poppins-bold",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.WHITE,
  },
  paragraph: {
    fontSize: 18,
    fontFamily: "poppins",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.WHITE
  },
  getstarted: {
    backgroundColor: "#4caf50",
    color: "#ffffff",
    padding: 10,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  welcomeImg: {
    marginTop: 40,
    width: 210,
    height: 440,
    borderColor: "black",
    borderRadius:20,
    borderWidth:5
  },
  bgBottom: {
    backgroundColor: Colors.BLACK,
    width: "100%",
    height: "100%",
    marginTop: -30,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    padding:20
  },
});
