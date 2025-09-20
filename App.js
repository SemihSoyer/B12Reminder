import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { REQUIRED_FONTS } from './src/constants/fonts';
import AppNavigator from './src/navigation/AppNavigator';

// Splash screen'i manuel kontrol et
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts(REQUIRED_FONTS);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
