import React from "react";
import { Stack } from "expo-router";
import { TranslationProvider } from "../../contexts/translationContext";

export default function AuthLayout() {
  return (
    <TranslationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </TranslationProvider>
  );
}
