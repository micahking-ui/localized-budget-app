//importation of dependacies
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import CourseInfo from "../components/CourseDetail/CourseInfo";
import CourseItemList from "../components/CourseDetail/CourseItemList";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../utils/Colors";
import { supabase } from "../app/lib/supabase-client";
import { TranslationContext } from "../contexts/translationContext";

export default function CategoryDetails() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    categoryId && getCategoryDetail();
    console.log(categoryId);
  }, [categoryId]);

  //getting category data from the database
  const getCategoryDetail = async () => {
    const { data, error } = await supabase
      .from("Category")
      .select("*, CategoryItems(*)")
      .eq("id", categoryId);
    setCategoryData(data[0]);
  };

  //user interface design
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {/** back button */}
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Ionicons name="arrow-back-circle" size={44} color="PRIMARY" />
        </TouchableOpacity>

        {/** importing category data  */}
        <CourseInfo categoryData={categoryData} />

        {/** Category items */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <CourseItemList
            categoryData={categoryData}
            setUpdateRecord={() => getCategoryDetail()}
          />
        </ScrollView>
      </View>
      {/**add category items button */}
      <Link
        href={{
          pathname: "/add-new-category-item",
          params: {
            categoryId: categoryData.id,
          },
        }}
        style={styles.floatingbtn}
      >
        <Ionicons name="add-circle" size={64} color={Colors.PRIMARY} />
      </Link>
    </View>
  );
}

// styling
const styles = StyleSheet.create({
  floatingbtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  container: {
    padding: 20,
    marginTop: 20,
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
