import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import LocationProvider from './src/components/LocationProvider';
import GlobalSnackbar from './src/components/GlobalSnackbar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '351470520572-e1nq0b5s2thdunn7nps2n44m77n0bdif.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  return (
    <Provider store={store}>
    <SafeAreaProvider>
      <LocationProvider>
        {/* <StatusBar barStyle="dark-content" /> */}
        {/* <StatusBar barStyle="light-content" backgroundColor="#156778" /> */}
        <RootNavigator />
      </LocationProvider>
      <GlobalSnackbar />
    </SafeAreaProvider>
    </Provider>
  );
}
