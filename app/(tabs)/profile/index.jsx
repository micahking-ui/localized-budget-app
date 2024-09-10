import {
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase-client";
import Colors from "../../../utils/Colors";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TranslationContext } from "../../../contexts/translationContext";

export default function SettingPage() {
  const { translations } = useContext(TranslationContext);
  const router = useRouter();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        router.replace("/(auth)/login"); //
      }
    });
  }, []);
//logout function
  const doLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null); // Clear user state
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(translations.errors?.signout);
    }
  };

  const profileMenu = [
    {
      id: 1,
      name: "Gida",
      icon: "home",
      route: "(tabs)/home/",
    },
    {
      id: 2,
      name: "Kudi",
      icon: "contract",
      route: "expense",
    },
    {
      id: 3,
      name: "Fita",
      icon: "log-out",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: Colors.WHITE }}>
        <View
          style={{ padding: 20, paddingTop: 30, backgroundColor: Colors.PRIMARY }}
        >
          <Text
            style={{
              fontFamily: "poppins-bold",
              paddingTop: 10,
              fontSize: 20,
              color: Colors.WHITE,
              opacity: 0.8,
            }}
          >
            {translations.terms?.profile}
          </Text>
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
          </View>
        </View>
        <View
          style={{
            paddingTop: 10,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 10,
              marginHorizontal: 10,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "poppins",
                color: Colors.WHITE,
                textAlign: "center",
              }}
            >
              {user?.email}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.WHITE,
              padding: 10,
              marginHorizontal: 10,
              borderRadius: 4,
              marginTop: 25,
              elevation: 4,
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
                  <Ionicons name={item.icon} size={25} color={Colors.PRIMARY} />
                  <Text>{item.name} </Text>
                </TouchableOpacity>
              )}
            />
          </View>
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
    gap: 20,
    marginBottom: 20,
    paddingHorizontal: 50,
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
