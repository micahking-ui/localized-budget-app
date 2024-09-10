import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import Colors from "../utils/Colors";
import { useRouter } from "expo-router";
import { TranslationContext } from "../contexts/translationContext";

export default function CategoryList({ categoryList }) {
  const {translations}=useContext(TranslationContext)
  const router = useRouter();
  
  //passing category params (id to the next page)
  const onCategoryClick = (category) => {
    router.push({
      pathname: "/category-detail",
      params: {
        categoryId: category.id,
      },
    });
  };

  //calculating total estimated budget
  const calculateTotalCost = (categoryItems) => {
    let totalCost = 0;
    categoryItems.forEach((item) => {
      totalCost = totalCost + item.cost;
    });
    return totalCost;
  };


  //designing of the user interface
  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "poppins-bold",
          fontSize: 26,
          marginBottom: 5,
        }}
      >
       {translations.terms?.latest}
      </Text>

      <View>
        {categoryList &&
          categoryList?.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.container}
              onPress={() => onCategoryClick(category)}
            >
              <View style={styles.iconContainer}>
                <Text
                  style={[styles.iconText, { backgroundColor: category.color }]}
                >
                  {category.icon}
                </Text>
              </View>
              <View style={styles.subContainer}>
                <View>
                  <Text style={styles.categoryText}>{category.name}</Text>
                  <Text style={styles.countItem}>
                    {category?.CategoryItems?.length} {translations.itemlist?.items}
                  </Text>
                </View>
                <Text style={styles.totalAmount}>
                  ₦ {calculateTotalCost(category?.CategoryItems)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}
//styling components
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderRadius: 15,
  },
  iconText: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    fontSize: 35,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "baseline",
  },

  categoryText: {
    fontFamily: "poppins-medium",
    fontSize: 20,
  },
  countItem: {
    fontFamily: "poppins",
    opacity: 0.3,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  totalAmount: {
    fontFamily: "poppins-bold",
    fontSize: 17,
  },
});
