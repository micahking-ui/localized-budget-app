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
import React, { useState, useEffect } from "react";
import Colors from "../utils/Colors";
import ColorPicker from "../components/ColorPicker";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../app/lib/supabase-client";

export default function EditCategory() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState(Colors.BLACK);
  const [categoryName, setCategoryName] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCategoryData();
  }, [categoryId]);
  async function fetchCategoryData() {
    const { data, error } = await supabase
      .from("Category")
      .select("name, assigned_budget, icon, color")
      .eq("id", categoryId)
      .single();

    if (data) {
      setCategoryName(data.name);
      console.log("Assigned budget:", data.assigned_budget);
      setTotalBudget(data.assigned_budget.toString());
      setSelectedIcon(data.icon);
      setSelectedColor(data.color);
    }
  }
  const onUpdateCategory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Category")
      .update({
        name: categoryName,
        assigned_budget: totalBudget,
        icon: selectedIcon,
        color: selectedColor,
      })
      .eq("id", categoryId)
      .select();

    if (data) {
      setLoading(false);
      router.replace({
        pathname: "/category-detail",
        params: {
          categoryId,
        },
      });

      ToastAndroid.show("Category updated!", ToastAndroid.SHORT);
    }
  };

  return (
    <KeyboardAvoidingView>
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
            value={selectedIcon}
            onChangeText={(value) => setSelectedIcon(value)}
          />
          <ColorPicker
            selectedColor={selectedColor}
            setSelectedColor={(color) => setSelectedColor(color)}
          />
        </View>

        <View style={styles.inputView}>
          <MaterialIcons name="local-offer" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Category Name"
            style={{
              fontSize: 16,
              fontFamily: "poppins-medium",
              width: "100%",
            }}
            value={categoryName}
            onChangeText={(value) => setCategoryName(value)}
          />
        </View>
        <View style={styles.inputView}>
          <FontAwesome6 name="naira-sign" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Total Budget"
            style={{
              fontSize: 16,
              fontFamily: "poppins-medium",
              width: "100%",
            }}
            keyboardType="numeric"
            value={totalBudget}
            onChangeText={(value) => setTotalBudget(value)}
          />
        </View>
        <TouchableOpacity
          style={styles.Tbutton}
          onPress={onUpdateCategory}
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
              Update
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
