import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import { supabase } from "../../app/lib/supabase-client";
import { Link, useRouter } from "expo-router";

export default function CourseInfo({ categoryData }) {
  const router = useRouter();
  const [totalCost, setTotalCost] = useState();
  const [perTotal, setPerTotal] = useState(0);
  const [sortedItems, setSortedItems] = useState([]);
  const [exceedsBudget, setExceedsBudget] = useState(false);
  const [showAdvice, setShowAdvice] = useState(true);

  useEffect(() => {
    categoryData && calculateTotalPerc();
  }, [categoryData]);
  const calculateTotalPerc = () => {
    let total = 0;
    const sortedItems = categoryData?.CategoryItems?.sort(
      (a, b) => a.cost - b.cost
    );
    setSortedItems(sortedItems);
    sortedItems?.forEach((item) => {
      total = total + item.cost;
      if (total > categoryData.assigned_budget) {
        setExceedsBudget(true);
      }
    });
    setTotalCost(total);
    let per = (total / categoryData.assigned_budget) * 100;
    if (per > 100) {
      per = 100;
    }
    setPerTotal(per);
  };

  const onDeleteCategory = async () => {
    Alert.alert("Are you sure", "Do you really want to delete?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",

        onPress: async () => {
          const { error } = await supabase
            .from("CategoryItems")
            .delete()
            .eq("category_id", categoryData.id);

          await supabase.from("Category").delete().eq("id", categoryData.id);
          ToastAndroid.show("Category Deleted", ToastAndroid.SHORT);
          router.replace("/(tabs)/home/");
        },
      },
    ]);
  };
  const toggleAdvice = () => {
    setShowAdvice(!showAdvice);
  };

  return (
    <View>
      <View style={styles.Container}>
        <View style={styles.iconContainer}>
          <Text
            style={[styles.textIcon, { backgroundColor: categoryData?.color }]}
          >
            {categoryData?.icon}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={styles.CategoryName}>{categoryData?.name}</Text>
          <Text style={styles.CategoryItem}>
            {categoryData?.CategoryItems?.length} Items
          </Text>
          <Text style={styles.url} numberOfLines={2}>
            {new Date(categoryData?.created_at).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity onPress={onDeleteCategory}>
          <Ionicons name="trash" size={25} color="red" />
        </TouchableOpacity>
        <Link
          href={{
            pathname: "/edit-category",
            params: {
              categoryId: categoryData.id,
            },
          }}
          style={{ marginLeft: 6 }}
        >
          <Ionicons
            name="pencil"
            size={25}
            style={{
              borderRadius: 5,
              padding: 2,
            }}
            color="black"
          />{" "}
        </Link>
      </View>
      {/**Prograss bar */}
      <View style={styles.AmountContainer}>
        <Text style={{ fontFamily: "poppins-medium" }}>₦ {totalCost}</Text>
        <Text style={{ fontFamily: "poppins", fontSize: 12 }}>
          {categoryData?.assigned_budget - totalCost}
        </Text>
        <Text style={{ fontFamily: "poppins-medium" }}>
          Total Budget: ₦ {categoryData?.assigned_budget}
        </Text>
      </View>
      <View style={styles.prograssBarMain}>
        <View style={[styles.prograssBarSub, { width: perTotal + "%" }]}></View>
      </View>

      {exceedsBudget && (
        <View style={{ marginTop: 20 }}>
          {showAdvice && (
            <View style={styles.adviceCon}>
              <Text
                style={{
                  fontFamily: "poppins-medium",
                  color: "#00698f",
                  textAlign: "justify",
                  fontSize: 15,
                }}
              >
                **Suggestion:** Consider prioritizing the most affordable items
                first to stay within your budget.
              </Text>
              <Text style={{ fontFamily: "poppins-bold",   fontSize: 15, }}>
                Suggested Order:
              </Text>
              <View>
                {sortedItems?.map((item, index) => (
                  <View
                    key={index}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <Text
                      style={{ fontFamily: "poppins-medium", fontSize: 16 }}
                    >
                      {index + 1}. {item.name}
                    </Text>
                    <Text  style={{ fontFamily: "poppins-bold", fontSize: 16 }} > ₦{item.cost}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity onPress={toggleAdvice}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: "poppins-medium",
                  color: "#00698f",
                  marginLeft: 12,
                  marginTop:5
                }}
              >
                {showAdvice ? "Hide" : "Show Suggestion"}
              </Text>
              <Ionicons
                name={showAdvice ? "chevron-up" : "chevron-down"}
                size={16}
                color="#00698f"
                style={{ marginLeft: 5, marginTop: 7 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.heading}>List of Items</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  adviceCon: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 15,
    elevation: 1,
  },
  AmountContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  heading: {
    fontFamily: "poppins-medium",
    fontSize: 20,
    marginTop: 10,
  },
  Container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textIcon: {
    fontSize: 25,
    padding: 20,
    borderRadius: 15,
  },
  url: {
    fontFamily: "poppins",
    color: Colors.GRAY,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "baseline",
  },
  CategoryName: {
    fontFamily: "poppins-bold",
    fontSize: 20,
  },
  CategoryItem: {
    fontFamily: "poppins",
    fontSize: 14,
  },
  prograssBarMain: {
    width: "100%",
    height: 15,
    backgroundColor: Colors.GRAY,
    borderRadius: 99,
    marginTop: 7,
  },
  prograssBarSub: {
    width: "40%",
    height: 15,
    backgroundColor: Colors.BLACK,
    borderRadius: 99,
  },
});
