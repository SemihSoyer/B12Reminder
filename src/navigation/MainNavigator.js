import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';

// Feature Screens
import BirthdayReminderScreen from '../screens/features/BirthdayReminderScreen';
import MenstrualTrackingScreen from '../screens/features/MenstrualTrackingScreen';
import MedicationReminderScreen from '../screens/features/MedicationReminderScreen';
import CustomRemindersScreen from '../screens/features/CustomRemindersScreen';
import HelpScreen from '../screens/main/HelpScreen';
import PaywallScreen from '../screens/main/PaywallScreen';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="BottomTabs" 
        component={BottomTabNavigator}
      />
      
      {/* Feature Screens */}
      <Stack.Screen 
        name="BirthdayReminder" 
        component={BirthdayReminderScreen}
      />
      <Stack.Screen 
        name="MenstrualTracking" 
        component={MenstrualTrackingScreen}
      />
      <Stack.Screen 
        name="MedicationReminder" 
        component={MedicationReminderScreen}
      />
      <Stack.Screen 
        name="CustomReminders" 
        component={CustomRemindersScreen}
      />
      
      {/* Other Screens */}
      <Stack.Screen 
        name="Help" 
        component={HelpScreen}
      />
      <Stack.Screen 
        name="Paywall" 
        component={PaywallScreen}
      />
    </Stack.Navigator>
  );
}
