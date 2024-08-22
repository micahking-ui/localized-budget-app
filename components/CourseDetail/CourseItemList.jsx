import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../app/lib/supabase-client";
import { TranslationContext } from "../../contexts/translationContext";

export default function CourseItemList({ categoryData, setUpdateRecord }) {
  const {translation}=useContext(TranslationContext);
  const [expandItems, setExpandItems] = useState();
  const onDeleteItem = async (id) => {
    const { error } = await supabase
      .from("CategoryItems")
      .delete()
      .eq("id", id);
    ToastAndroid.show("Item Deleted!", ToastAndroid.SHORT);
    setUpdateRecord(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginTop: 15 }}>
        {categoryData?.CategoryItems?.length > 0 ? (
          categoryData?.CategoryItems?.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => setExpandItems(index)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 70, height: 70, borderRadius: 15 }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.url} numberOfLines={2}>
                    {item.note}
                  </Text>
                </View>
                <Text style={styles.cost}> ₦{item.cost}</Text>
              </TouchableOpacity>
              {expandItems == index && (
                <View style={styles.actionItemCOintainer}>
                  <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
                    <Ionicons name="trash" size={25} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              {categoryData?.CategoryItems?.length - 1 != item.id && (
                <View
                  style={{
                    borderWidth: 0.5,
                    marginTop: 10,
                    borderColor: Colors.GRAY,
                  }}
                ></View>
              )}
            </React.Fragment>
          ))
        ) : (
          <Text style={styles.noTextFound}>No Items Found</Text>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: "poppins",
  },
  url: {
    fontFamily: "poppins-medium",
    color: Colors.GRAY,
  },
  cost: {
    fontFamily: "poppins-medium",
    fontSize: 20,
    marginLeft: 10,
  },
  noTextFound: {
    fontFamily: "poppins-bold",
    fontSize: 30,
    color: Colors.GRAY,
  },
  actionItemCOintainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
});
