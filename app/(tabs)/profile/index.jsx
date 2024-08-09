import {
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase-client";
import Colors from "../../../utils/Colors";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        router.replace("/(auth)/login"); // Redirect to login if no user
      }
    });
  }, []);

  const doLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null); // Clear user state
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error Signing Out User", error.message);
    }
  };

  const profileMenu = [
    {
      id: 1,
      name: "Home",
      icon: "home",
      route: "(tabs)/home/",
    },
    {
      id: 2,
      name: "Expense",
      icon: "contract",
      route: "expense",
    },
    {
      id: 3,
      name: "Log-Out",
      icon: "log-out",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View
          style={{ padding: 20, paddingTop: 30, backgroundColor: Colors.BLACK }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              color: Colors.WHITE,
              marginTop: 20,
            }}
          >
            <Image
              source={require("../../../assets/user.png")}
              style={{
                width: 90,
                height: 90,
                borderRadius: 99,
              }}
            />
            <Text
              style={{
                fontSize: 25,
                marginTop: 8,
                fontFamily: "poppins-bold",
                color: Colors.WHITE,
              }}
            >
              {user?.email.split("@")[0]}
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontFamily: "poppins",
                color: Colors.WHITE,
              }}
            >
              {user?.email}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingTop: 40,
            backgroundColor: "white",
            paddingBottom: 100,
          }}
        >
          <FlatList
            data={profileMenu}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.id === 3) {
                    doLogout(); // Call the logout function when the logout button is pressed
                  } else if (item.id === 1) {
                    router.push(item.route);
                  } else {
                    navigation.navigate(item.route); // Navigate to the specified route for other buttons
                  }
                }}
                style={styles.textContainer}
              >
                <Ionicons name={item.icon} size={44} color={Colors.BLACK} />
                <Text>{item.name} </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
    paddingHorizontal: 80,
  },
  ButtonContainer: {
    backgroundColor: "#000965",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 8,
    marginBottom: 25,
  },
  ButtonText: {
    padding: 5,
    fontSize: 18,
    color: "white",
    fontFamily: "poppins",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
