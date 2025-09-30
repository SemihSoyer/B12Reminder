import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import SettingsSection from '../../components/profile/SettingsSection';

export default function SettingsScreen({ navigation }) {
  // Ayarlar state'leri
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Ayarlar bölümleri
  const notificationSettings = [
    {
      icon: 'notifications-outline',
      title: 'Bildirimler',
      subtitle: 'Hatırlatıcı bildirimleri',
      type: 'switch',
      isEnabled: notificationsEnabled,
      onPress: () => setNotificationsEnabled(!notificationsEnabled),
    },
    {
      icon: 'volume-high-outline',
      title: 'Ses',
      subtitle: 'Bildirim sesleri',
      type: 'switch',
      isEnabled: soundEnabled,
      onPress: () => setSoundEnabled(!soundEnabled),
    },
  ];

  const appearanceSettings = [
    {
      icon: 'moon-outline',
      title: 'Koyu Mod',
      subtitle: 'Koyu tema kullan',
      type: 'switch',
      isEnabled: darkModeEnabled,
      onPress: () => setDarkModeEnabled(!darkModeEnabled),
    },
  ];

  const generalSettings = [
    {
      icon: 'language-outline',
      title: 'Dil',
      subtitle: 'Uygulama dili',
      value: 'Türkçe',
      type: 'action',
      onPress: () => Alert.alert('Bilgi', 'Dil seçenekleri yakında eklenecek'),
    },
    {
      icon: 'time-outline',
      title: 'Saat Formatı',
      subtitle: '24 saat / 12 saat',
      value: '24 saat',
      type: 'action',
      onPress: () => Alert.alert('Bilgi', 'Saat formatı seçenekleri yakında eklenecek'),
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Ayarlar</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Bildirim Ayarları */}
          <SettingsSection
            title="Bildirimler"
            items={notificationSettings}
          />

          {/* Görünüm Ayarları */}
          <SettingsSection
            title="Görünüm"
            items={appearanceSettings}
          />

          {/* Genel Ayarlar */}
          <SettingsSection
            title="Genel"
            items={generalSettings}
          />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
