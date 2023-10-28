import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Detail from "./screens/Detail";
import ListObser from "./screens/ListObser";
import AddObser from "./screens/AddObser";
import { useRoute } from "@react-navigation/native";
import DetailOb from "./screens/DetailOb";

export const StackOB = () => {
  const Stack = createStackNavigator();
  const route = useRoute();
  const { idHike } = route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="LISTOB"
        children={() => <ListObser idHike={idHike} />}
      />
      <Stack.Screen name="ADDOB" component={AddObser} />
      <Stack.Screen name="DETAILOB" component={DetailOb} />
    </Stack.Navigator>
  );
};
