import React, { useContext, useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { TranslationProvider } from "../contexts/translationContext";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    "poppins-medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "poppins-black": require("../assets/fonts/Poppins-Black.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <TranslationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="add-new-category"
          options={{
            presentation: "modal",
           
          }}
        />

        <Stack.Screen
          name="add-new-category-item"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Add New Items",
            
          }}
        />
        <Stack.Screen
          name="edit-category"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Edit Category",
          }}
        />
      </Stack>
    </TranslationProvider>
  );
}
