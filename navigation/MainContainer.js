import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Add from "./screens/Add";
import Search from "./screens/Search";
import { db } from "../configs/dbOpen";
import { StackHome } from "./StackHome";

const defaultNameScreen = {
  home: "HOME",
  search: "SEARCH",
  add: "ADD",
  detail: "DETAIL",
};

const Tab = createBottomTabNavigator();
export default function MainContainer() {
  useEffect(() => {
    createdB();
  }, []);

  const createdB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS mhikeDataB (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT,
         location TEXT,
         dateHike TEXT,
         length NUMERIC,
         level TEXT,
         parkingAvailable TEXT,
         description TEXT
       );`,
        null,
        async (txtObj, resultSet) =>
          console.log("create a table ok", resultSet),
        (txtObj, error) => console.log("error create table", error)
      );
      console.log("vo");
    });
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={defaultNameScreen.home}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let ic;
            let rt = route.name;

            if (rt == defaultNameScreen.home) {
              ic = focused ? "home" : "home-outline";
            } else if (rt == defaultNameScreen.search) {
              ic = focused ? "search" : "search";
            } else if (rt == defaultNameScreen.add) {
              ic = focused ? "add-circle" : "add-circle-outline";
            }

            return <Ionicons name={ic} size={size} color={color} />;
          },
          headerShown: true,
        })}
      >
        <Tab.Screen
          name={defaultNameScreen.home}
          component={StackHome}
        />
        <Tab.Screen name={defaultNameScreen.add} component={Add} />
        <Tab.Screen name={defaultNameScreen.search} component={Search} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
