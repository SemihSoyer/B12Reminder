import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import SettingsSection from '../../components/profile/SettingsSection';
import { showAlert } from '../../components/ui/CustomAlert';

export default function ProfileScreen({ navigation }) {
  const generalSettings = [
    {
      icon: 'language-outline',
      title: 'Language',
      subtitle: 'App language',
      value: 'English',
      type: 'action',
      onPress: () => showAlert('Info', 'Language options will be added soon', 'info'),
    },
  ];

  const accountSettings = [
    {
      icon: 'star-outline',
      title: 'Subscriptions',
      subtitle: 'Manage your subscriptions',
      type: 'navigation',
      onPress: () => navigation.navigate('Subscription'),
    },
  ];

  const appInfoSettings = [
    {
      icon: 'information-circle-outline',
      title: 'Version',
      value: '1.0.0',
      type: 'info',
    },
    {
      icon: 'book-outline',
      title: 'About',
      type: 'navigation',
      onPress: () => showAlert('About', 'This app is a great reminder app.', 'info'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help',
      type: 'navigation',
      onPress: () => showAlert(
        'Help',
        'For complaints and suggestions: sunmateapplication@gmail.com',
        'info'
      ),
    }
  ];

  // Developer/Test settings (only in development)
  const developerSettings = __DEV__ ? [
    {
      icon: 'flask-outline',
      title: 'Test Onboarding',
      subtitle: 'View onboarding screens',
      type: 'navigation',
      onPress: () => navigation.navigate('Onboarding'),
    },
  ] : [];

  return (
    <LinearGradient
      colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.title}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hesap Ayarları */}
          <SettingsSection
            title="Account"
            items={accountSettings}
          />

          {/* Genel Ayarlar */}
          <SettingsSection
            title="General"
            items={generalSettings}
          />

          {/* Uygulama Bilgileri */}
          <SettingsSection
            title="App Information"
            items={appInfoSettings}
          />

          {/* Developer Settings (only in development) */}
          {__DEV__ && developerSettings.length > 0 && (
            <SettingsSection
              title="Developer"
              items={developerSettings}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  settingsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#636e72',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
});