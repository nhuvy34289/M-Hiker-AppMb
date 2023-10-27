import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Detail from "./screens/Detail";

export const StackHome = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="MAIN" component={Home} options={{
        headerShown: false,
      }}/>
      <Stack.Screen name="DETAIL" component={Detail} />
    </Stack.Navigator>
  );
};
