//importation of the components and dependency
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import Colors from "../../../utils/Colors";
import Header from "../../../components/Header";
import CategoryList from "../../../components/CategoryList";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase-client";
import CircularChart from "../../../components/CircularChart";
import { Alert } from "react-native";

//function declaration
export default function Home() {

  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [categoryList, setCategoryList] = useState();
  const [user, setUser] = useState(null);
  //use that execute once mounted
  useEffect(() => {
    getCategoryList();
  }, []);

  //getting category data from the database
  const getCategoryList = async () => {
    try {
      
      const {data: { user }, } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from("Category")
          .select("*, CategoryItems(*)")
          .eq("created_by", user.email);
        setCategoryList(data);
        data && setloading(false);
      } else {
        Alert.alert("Error accessing User");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load categories. Please try again later."
      );
      console.error(error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => getCategoryList()}
            refreshing={loading}
          />
        }
      >
        <View
          style={{
            padding: 20,
            backgroundColor: Colors.BLACK,
            height: 190,
          }}
        >
          <Header />
        </View>
        <View
          style={{
            padding: 20,
            marginTop: -90,
          }}
        >
          <CircularChart categoryList={categoryList} />
          <CategoryList categoryList={categoryList} />
        </View>
      </ScrollView>
      <Link href={"/add-new-category"} style={styles.addButton}>
        <Ionicons name="add-circle" size={64} color={Colors.BLACK} />
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
