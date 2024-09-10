//importation of dependdencies and component
import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PieChart from "react-native-pie-chart";
import { useEffect } from "react";
import { TranslationContext } from "../contexts/translationContext";

export default function CircularChart({ categoryList }) {
  const widthAndHeight = 125;
  const [values, setValues] = useState([1]);
  const [sliceColor, setSliceColor] = useState([Colors.GRAY]);
  const [totalEstimate, setTotalEstimate] = useState();
  const { translations } = useContext(TranslationContext);
  //mounted when the application load
  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      updateCircularChart();
    }
  }, [categoryList]);

  // function that update the circular chart
  const updateCircularChart = () => {
    if (!categoryList) return;
    let totalEstimate = 0;
    setSliceColor([]);
    setValues([]);
    let otherCost = 0;

//mapping category data
    categoryList?.forEach((item, index) => {
      let itemTotalCost = 0;
      item.CategoryItems?.forEach((item_) => {
        itemTotalCost += item_.cost;
        totalEstimate += item_.cost;
      });
      if (itemTotalCost > 0) {
        setSliceColor((sliceColor) => [
          ...sliceColor,
          Colors.COLOR_LIST[index],
        ]);
        setValues((values) => [...values, itemTotalCost]);
      } else {
        otherCost += item.assigned_budget;
      }
    });
    if (otherCost > 0) {
      setSliceColor((sliceColor) => [...sliceColor, Colors.COLOR_LIST[4]]);
      setValues((values) => [...values, otherCost]);
    }
    setTotalEstimate(totalEstimate);
  };

  //user interface design
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontFamily: "poppins" }}>
        {translations.terms?.estimate}:
        <Text style={{ fontFamily: "poppins-bold" }}> ₦ {totalEstimate}</Text>
      </Text>
      <View style={styles.subContainer}>
        
        {/** pie chart */}
        <PieChart
          widthAndHeight={widthAndHeight}
          series={values}
          sliceColor={sliceColor}
          coverRadius={0.66}
          coverFill={"#fff"}
        />
        <View>
          {categoryList ? (
            categoryList?.map(
              (category, index) =>
                index <= 4 && (
                  <View key={index} style={styles.cirCular}>
                    <MaterialCommunityIcons
                      name="checkbox-blank-circle"
                      size={25}
                      color={Colors.COLOR_LIST[index]}
                    />
                    <Text
                      style={{
                        fontFamily: "poppins-medium",
                      }}
                    >
                      {index < 4 ? category.name : "Other"}
                    </Text>
                  </View>
                )
            )
          ) : (
            <View style={styles.cirCular}>
              <MaterialCommunityIcons
                name="checkbox-blank-circle"
                size={25}
                color={Colors.GRAY}
              />
              <Text
                style={{
                  fontFamily: "poppins-bold",
                }}
              >
                NA
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
// styling components
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 15,
    elevation: 1,
  },
  subContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  cirCular: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 4,
  },
});
