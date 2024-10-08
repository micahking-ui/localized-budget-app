import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "../../../utils/Colors";
import { supabase } from "../../lib/supabase-client";
import { useLocalSearchParams } from "expo-router";
import { TranslationContext } from "../../../contexts/translationContext";

export default function ExpensePage() {
  const {translations}=useContext(TranslationContext);
  const { categoryId } = useLocalSearchParams();
  const [itemsData, setItemsData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [overallTotal, setOverallTotal] = useState(0);
  
  //getting current date
  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
    const year = date.getFullYear();
    setCurrentDate(`${day} ${translations.months?.[month]}, ${year}`);

    //getting all items
    getAllItems();
    console.log("get item", getAllItems); 
    console.log('translations.months:', translations.months);
  }, [translations]);

  //method for getting all category items
  const getAllItems = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: categories, error: categoriesError } = await supabase
          .from("Category")
          .select("id")
          .eq("created_by", user.email);

        if (categoriesError) {
          console.error(categoriesError);
        } else {
          const categoryIds = categories.map((category) => category.id);
          const { data, error } = await supabase
            .from("CategoryItems")
            .select("*, created_at")
            .in("category_id", categoryIds);

          console.log(data);
          const groupedItems = data.reduce((acc, item) => {
            const month = new Date(item.created_at).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
            });
            if (!acc[month]) {
              acc[month] = { items: [], totalCost: 0 };
            }
            acc[month].items.push(item);
            acc[month].totalCost += item.cost;
            return acc;
          }, {});

          const overallTotal = Object.values(groupedItems).reduce(
            (acc, month) => acc + month.totalCost,
            0
          );

          setItemsData(groupedItems);
          setOverallTotal(overallTotal);
        }
      } else {
        Alert.alert(translations.errors?.user);
      }
    } catch (error) {
     
      console.error(error);
    }
  };
//user interface designed
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.todayText}>{translations.terms?.today}</Text>
        <View style={styles.currentContainer}>
          <Text style={styles.currentText}>{currentDate}</Text>
          <Text style={styles.TotalContainer}>₦ {overallTotal}</Text>
        </View>
        <View style={styles.Line1}></View>
      </View>
      <View style={styles.expenseCon}>
        <Text style={styles.monthExpen}>{translations.terms?.month}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(itemsData).map(([month, { items, totalCost }]) => (
            <View key={month}>
              <View style={styles.monthlyTotal}>
                <Text style={styles.monthlyText}>{translations.months?.[month.split(' ')[0].toLowerCase()]} {month.split(' ')[1]}</Text>
                <Text style={styles.monthText}>₦ {totalCost}</Text>
              </View>
              {items.map((item, index) => (
                <View key={index}>
                  <View style={styles.expenseView}>
                    <View style={styles.headingLine}>
                      <Text>
                        <FontAwesome6
                          name="money-bill-transfer"
                          size={24}
                          color="white"
                          style={styles.img}
                        />
                      </Text>
                    </View>
                    <Text style={styles.itemsText}>{item.name}</Text>
                    <Text style={styles.itemCost}>₦ {item.cost}</Text>
                  </View>
                  <View style={styles.lineBorder}></View>
                </View>
              ))}
              
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
//styling components
const styles = StyleSheet.create({
  currentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemCost: {
    fontSize: 18,
    fontFamily: "poppins-medium",
    color: "#e76f51",
  },
  monthText: {
    fontSize: 18,
    fontFamily: "poppins-bold",
    color: Colors.DARK,
    marginTop:-2
  },
  currentText: {
    fontSize: 18,
    fontFamily: "poppins-medium",
    color: "white",
  },
  monthlyText: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    color: Colors.DARK
  },
  todayText: {
    paddingTop: 5,
    fontSize: 20,
    fontFamily: "poppins-bold",
    color: Colors.WHITE,
  },
  TotalContainer: {
    fontSize: 18,
    fontFamily: "poppins-bold",
    color: "white",
    backgroundColor: Colors.EYES,
    borderRadius: 15,
    padding: 2,
    paddingHorizontal: 4,
  },
  headingContainer: {
    padding: 20,
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
  
  },
  Line1: {
    borderBottomWidth: 4,
    width: "100%",
    opacity: 0.5,
    marginTop: 5,
    borderColor: Colors.EYES,
    borderRadius: 15,
  },
  itemsText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "poppins",
    marginLeft: 15,
  },
  monthExpen: {
    fontSize: 20,
    fontFamily: "poppins-bold",
    color: Colors.PRIMARY,
    opacity: 0.8,
    marginTop: -4,
  },
  expenseView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 15,
  },
  headingLine: {
    height: 40,
    width: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.GRAY_LIGHT,
  },
  lineBorder: {
    borderBottomWidth: 2,
    width: "100%",
    opacity: 0.2,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingTop: 20,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 99,
  },
  expenseCon: {
    borderRadius: 15,
    height: 480,
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginHorizontal: 10,
    elevation: 20,
  },
  monthlyTotal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,

    marginTop: 4,
    padding: 2,
    borderRadius: 5,
  },
});
