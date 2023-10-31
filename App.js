import { StyleSheet } from 'react-native';
import MainContainer from './navigation/MainContainer'
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message'
LogBox.ignoreLogs(['new NativeEventEmitter']); 

export default function App() {
  return (
  <>
     <MainContainer />
     <Toast />
  </>
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
