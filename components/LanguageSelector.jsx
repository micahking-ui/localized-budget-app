import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // default language is English

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // You can also store the selected language in AsyncStorage or a state management system like Redux
  };

  return (
    <View>
      <Text>Language:</Text>
      <TouchableOpacity onPress={() => handleLanguageChange("en")}>
        <Text>English</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLanguageChange("ha")}>
        <Text>Hausa</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelector;
