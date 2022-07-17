import { Provider as ReduxProvider } from 'react-redux'
import Navigation from './src/Navigation/Navigation';
import { store } from "./src/Store/store"
import { StyleSheet, View } from 'react-native'
import React from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const App = () => {
  return (
    <ReduxProvider store={store}>
        <View style={styles.container}>
          <Navigation />
        </View>
    </ReduxProvider>
  )
}



export default App

