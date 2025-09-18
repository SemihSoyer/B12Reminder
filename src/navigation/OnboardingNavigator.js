import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import OnboardingFeaturesScreen from '../screens/onboarding/OnboardingFeaturesScreen';
import OnboardingPermissionsScreen from '../screens/onboarding/OnboardingPermissionsScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="OnboardingWelcome" 
        component={OnboardingWelcomeScreen} 
      />
      <Stack.Screen 
        name="OnboardingFeatures" 
        component={OnboardingFeaturesScreen} 
      />
      <Stack.Screen 
        name="OnboardingPermissions" 
        component={OnboardingPermissionsScreen} 
      />
    </Stack.Navigator>
  );
}
