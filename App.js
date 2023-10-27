import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainContainer from './navigation/MainContainer'
import { useEffect } from 'react'
import { db } from './configs/dbOpen';

export default function App() {

  const createdB = () => {
    db.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS mhikedb(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        location TEXT,
        dateHike TEXT,
        length NUMERIC,
        level TEXT,
        parkingAvailable TEXT,
        description TEXT
      );`,
        [],
        (txn, result) => console.log("create a table ok", result),
        (error) => console.log('error create table', error)
      )
    }) 
  }

  useEffect(() => {
    createdB();
  }, [])
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
