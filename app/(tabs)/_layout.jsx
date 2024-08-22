import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Color from "../../utils/Colors";
import { TranslationProvider } from "../../contexts/translationContext";

export default function TabLayout() {
  return (
    <TranslationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Color.BLACK,
          headerShown: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Color.BLACK,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Gida",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expense"
          options={{
            title: "Kudi ",

            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="history" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Shafina",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </TranslationProvider>
  );
}
