//importation of dependencies and components
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import { supabase } from "../../app/lib/supabase-client";
import { Link, useRouter } from "expo-router";
import { TranslationContext } from "../../contexts/translationContext";

export default function CourseInfo({ categoryData }) {
  //declaration of constant
  const router = useRouter();
  const [totalCost, setTotalCost] = useState();
  const [perTotal, setPerTotal] = useState(0);
  const [sortedItems, setSortedItems] = useState([]);
  const [exceedsBudget, setExceedsBudget] = useState(false);
  const [showAdvice, setShowAdvice] = useState(true);
  const { translations } = useContext(TranslationContext);

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
  // Function for deleting category data
  const onDeleteCategory = async () => {
    Alert.alert(translations.alerts?.sure, translations.alerts?.really, [
      {
        text: translations.alerts?.cancel,
        style: "cancel",
      },
      {
        text: translations.alerts?.yes,
        style: "destructive",

        onPress: async () => {
          const { error } = await supabase
            .from("CategoryItems")
            .delete()
            .eq("category_id", categoryData.id);

          await supabase.from("Category").delete().eq("id", categoryData.id);
          ToastAndroid.show("translations.errors?.deleted", ToastAndroid.SHORT);
          router.replace("/(tabs)/home/");
        },
      },
    ]);
  };
  // Show advice or suggestion order
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
            {translations.itemlist?.items} {categoryData?.CategoryItems?.length}
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
          {translations.itemlist?.total}: ₦ {categoryData?.assigned_budget}
        </Text>
      </View>
      <View style={styles.prograssBarMain}>
        <View style={[styles.prograssBarSub, { width: perTotal + "%" }]}></View>
      </View>
      {/**Exceed budget suggestion order */}
      {exceedsBudget && (
        <View style={{ marginTop: 20 }}>
          {showAdvice && (
            <View style={styles.adviceCon}>
              <Text
                style={{
                  fontFamily: "poppins-medium",
                  color: Colors.ORANGE,
                  textAlign: "justify",
                  fontSize: 15,
                }}
              >
                {translations.advices?.advice}
              </Text>
              <Text style={{ fontFamily: "poppins-bold", fontSize: 15 }}>
                {translations.advices?.order}
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
                    <Text style={{ fontFamily: "poppins-bold", fontSize: 16 }}>
                      {" "}
                      ₦{item.cost}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity onPress={toggleAdvice}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "poppins-medium",
                  color: Colors.ORANGE,
                  marginLeft: 12,
                  justifyContent: "space-evenly",
                  alignSelf: "center",
                }}
              >
                <Ionicons name="alert-circle" size={15} color={Colors.ORANGE} />
                {showAdvice
                  ? translations.advices?.hide
                  : translations.advices?.show}
              </Text>
              <Ionicons
                name={showAdvice ? "chevron-up" : "chevron-down"}
                size={14}
                color={Colors.ORANGE}
                style={{ marginLeft: 5, marginTop: 2 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.heading}>{translations.itemlist?.list}</Text>
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
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
  },
});
