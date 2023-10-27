import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainContainer from './navigation/MainContainer'
import { useEffect } from 'react'
import { db, createdB } from './configs/dbOpen';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); 

export default function App() {
  return (
    <MainContainer />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
