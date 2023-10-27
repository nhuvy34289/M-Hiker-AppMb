import { View, Text } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './screens/Home'
import Add from './screens/Add'
import Search from './screens/Search'


const defaultNameScreen = {
    home: 'HOME',
    search: 'SEARCH',
    add: 'ADD',
}

const Tab = createBottomTabNavigator();
export default function MainContainer() {
  return (
    <NavigationContainer>
        <Tab.Navigator
          initialRouteName={defaultNameScreen.home}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
                let ic;
                let rt = route.name;

                if(rt == defaultNameScreen.home) {
                    ic = focused ? 'home' : 'home-outline'
                } else if (rt == defaultNameScreen.search) {
                    ic = focused ? 'search' : 'search'
                }
                else if (rt == defaultNameScreen.add) {
                    ic = focused ? 'add-circle' : 'add-circle-outline'
                }

                return <Ionicons name={ic} size={size} color={color}/>
            }
          })}
        >
            <Tab.Screen name={defaultNameScreen.home} component={Home}/>
            <Tab.Screen name={defaultNameScreen.add} component={Add}/>
            <Tab.Screen name={defaultNameScreen.search} component={Search}/>

        </Tab.Navigator>
    </NavigationContainer>
  )
}