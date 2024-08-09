import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../app/lib/supabase-client";
import Colors from "../utils/Colors";
import { TranslationContext } from "../contexts/translationContext";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { translations, handleLanguageChange } = useContext(TranslationContext);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Error accessing User");
      }
    });
  }, []);
  // used to get user data

  return (
    <View style={{ paddingTop: 18 }}>
      <View style={styles.headingStyle}>
        <Image source={require("../assets/user.png")} style={styles.img} />
        <View style={styles.container}>
          <View>
            <Text
              style={{
                color: Colors.WHITE,
                fontSize: 20,
                fontFamily: "poppins",
              }}
            >
              {translations.details?.welcome}
            </Text>

            {user ? (
              <Text
                style={{
                  color: Colors.WHITE,
                  fontSize: 20,
                  fontFamily: "poppins-bold",
                  marginTop: -8,
                }}
              >
                {user?.email.split("@")[0]}
              </Text>
            ) : (
              <ActivityIndicator color={Colors.WHITE} />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              onPress={() => handleLanguageChange("hausa")}
              style={{
                marginRight: 5,
                backgroundColor: Colors.WHITE,
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: Colors.BLACK }}>Ha</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLanguageChange("english")}
              style={{
                marginLeft: 5,
                backgroundColor: Colors.WHITE,
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Text>En</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
  },
  img: {
    width: 55,
    height: 55,
    borderRadius: 99,
  },
  headingStyle: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 15,
  },
});
