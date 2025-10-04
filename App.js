import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { REQUIRED_FONTS } from './src/constants/fonts';
import AppNavigator from './src/navigation/AppNavigator';
import CustomAlert from './src/components/ui/CustomAlert';
import { NotificationService } from './src/utils/notificationService';

// Splash screen'i manuel kontrol et
SplashScreen.preventAutoHideAsync();

// Notification handler'ı ayarla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts(REQUIRED_FONTS);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Notification permissions'ı başlangıçta kaydet
  useEffect(() => {
    NotificationService.registerForPushNotificationsAsync();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <CustomAlert />
    </SafeAreaProvider>
  );
}
