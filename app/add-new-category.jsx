import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";

import React, { useState, useEffect, useContext } from "react";
import Colors from "../utils/Colors";
import ColorPicker from "../components/ColorPicker";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { supabase } from "../app/lib/supabase-client";
import { TranslationContext } from "../contexts/translationContext";

export default function AddNewCategory() {
  const router = useRouter();

  const [selectedIcon, setSelectedIcon] = useState("BT");
  const [selectedColor, setSelectedColor] = useState(Colors.BLACK);
  const [categoryName, setCategoryName] = useState();
  const [totalBudget, setTotalBudget] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Error accessing User");
      }
    });
  }, [translations]);

  const onCreatCategory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Category")
      .insert([
        {
          name: categoryName,
          assigned_budget: totalBudget,
          icon: selectedIcon,
          color: selectedColor,
          created_by: user?.email,
        },
      ])
      .select();
    console.log(data);
    if (data) {
      setLoading(false);
      router.replace({
        pathname: "/category-detail",
        params: {
          categoryId: data[0].id,
        },
      });

      ToastAndroid.show("Category Created!", ToastAndroid.SHORT);
    }
  };
  return (
    <KeyboardAvoidingView>
      <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: translations.cat?.heading
      }}/>
      <ScrollView
        style={{
          marginTop: 10,
          padding: 20,
          backgroundColor: Colors.WHITE,
          height: "100",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            style={[styles.iconInput, { backgroundColor: selectedColor }]}
            maxLength={2}
            onChangeText={(value) => setSelectedIcon(value)}
          >
            {selectedIcon}
          </TextInput>
          <ColorPicker
            selectedColor={selectedColor}
            setSelectedColor={(color) => setSelectedColor(color)}
          />
        </View>

        <View style={styles.inputView}>
          <MaterialIcons name="local-offer" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder={translations.cat?.name1}
            style={{
              fontSize: 16,
              fontFamily: "poppins-medium",
              width: "100%",
            }}
            onChangeText={(value) => setCategoryName(value)}
          />
        </View>
        <View style={styles.inputView}>
          <FontAwesome6 name="naira-sign" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder={translations.cat?.cost1}
            style={{
              fontSize: 16,
              fontFamily: "poppins-medium",
              width: "100%",
            }}
            keyboardType="numeric"
            onChangeText={(value) => setTotalBudget(value)}
          />
        </View>
        <TouchableOpacity
          style={styles.Tbutton}
          onPress={onCreatCategory}
          disabled={!categoryName || !totalBudget || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text
              style={{
                textAlign: "center",
                alignItems: "center",
                fontFamily: "poppins-bold",
                fontSize: 16,
                color: "white",
              }}
            >
              {translations.cat?.create}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  iconInput: {
    textAlign: "center",
    fontSize: 24,
    borderRadius: 99,
    padding: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.DIM,
    color: Colors.WHITE,
  },
  inputView: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 5,
    padding: 14,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    marginTop: 10,
    backgroundColor: "white",
  },
  Tbutton: {
    backgroundColor: Colors.BLACK,
    padding: 15,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    marginTop: 30,
  },
});
