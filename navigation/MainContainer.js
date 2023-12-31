import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Add from "./screens/Add";
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
    createDbObser();
  }, []);

  const createdB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS MHikeD (
         hike_id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      console.log("accessed hike table");
    });
  };
  const createDbObser = () => {
    db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ObserD (
           id_ob INTEGER PRIMARY KEY AUTOINCREMENT,
           observation TEXT,
           time TEXT,
           comments TEXT,
           hike_id INTEGER NOT NULL,
           FOREIGN KEY (hike_id)
               REFERENCES MHikeD (hike_id)
         );`,
          null,
          async (txtObj, resultSet) =>
            console.log("create a table ok", resultSet),
          (txtObj, error) => console.log("error create table", error)
        );
        console.log("accessed obser table");
    });
  }
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
