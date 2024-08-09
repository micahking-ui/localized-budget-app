import hausaData from "../utils/LanguageSelector/hausa.json";
import englishData from "../utils/LanguageSelector/english.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "language";

const LanguageStorage = {
  async setLanguage(language) {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error setting language:", error);
    }
  },

  async getLanguage() {
    try {
      const language = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (language === "hausa") {
        return hausaData;
      } else if (language === "english") {
        return englishData;
      } else {
        return englishData; // default to english
      }
    } catch (error) {
      console.error("Error getting language:", error);
    }
  },
};

export default LanguageStorage;
