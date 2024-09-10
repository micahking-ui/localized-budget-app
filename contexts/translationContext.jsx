import { createContext, useState, useEffect } from "react";
import LanguageStorage from "../utils/services";

// creating context for language selection
const TranslationContext = createContext();

const TranslationProvider = ({ children }) => {
const [translations, setTranslations] = useState(null);

//mounted when the application load
  useEffect(() => {
    const loadTranslations = async () => {
      const languageData = await LanguageStorage.getLanguage();
      setTranslations(languageData);
    };
    loadTranslations();
  }, []);

  //handle language switching
  const handleLanguageChange = async (language) => {
    console.log(`Language changed to ${language}`);
    await LanguageStorage.setLanguage(language);
    const languageData = await LanguageStorage.getLanguage();
    setTranslations(languageData);
  };

  return (
    <TranslationContext.Provider value={{ translations, handleLanguageChange }}>
      {translations ? children : null}
    </TranslationContext.Provider>
  );
};

export { TranslationProvider, TranslationContext };
