import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Colors from "../utils/Colors";

//color picker function
export default function ColorPicker({ selectedColor, setSelectedColor }) {
  return (
    <View style={styles.Container}>
      {Colors.COLOR_LIST.map((color, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.ColorStyle, { backgroundColor:color},
            selectedColor == color && { borderWidth: 4 },
          ]}
          onPress={() => setSelectedColor(color)}
        ></TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  ColorStyle: {
    height: 30,
    width: 30,
    borderRadius: 99,
    borderColor: Colors.DARK,
  },
  Container: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
});
