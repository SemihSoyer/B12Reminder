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
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import MenuButton from '../../components/profile/MenuButton';

export default function ProfileScreen({ navigation }) {

  // Menü butonları
  const menuButtons = [
    {
      icon: 'settings-outline',
      title: 'Uygulama Ayarları',
      subtitle: 'Bildirimler, tema ve genel ayarlar',
      gradientColors: ['#74B9FF', '#0984E3'],
      onPress: () => handleMenuPress('settings'),
    },
    {
      icon: 'bar-chart-outline',
      title: 'İstatistikler',
      subtitle: 'Hatırlatıcı özetleri ve analizler',
      gradientColors: ['#00B894', '#00CEC9'],
      onPress: () => handleMenuPress('statistics'),
    },
    {
      icon: 'cloud-download-outline',
      title: 'Veri Yönetimi',
      subtitle: 'Yedekleme ve veri işlemleri',
      gradientColors: ['#A29BFE', '#6C5CE7'],
      onPress: () => handleMenuPress('dataManagement'),
    },
    {
      icon: 'information-circle-outline',
      title: 'Uygulama Bilgileri',
      subtitle: 'Versiyon, hakkında ve yardım',
      gradientColors: ['#FD79A8', '#E84393'],
      onPress: () => handleMenuPress('appInfo'),
    },
  ];

  const handleMenuPress = (menuType) => {
    switch (menuType) {
      case 'settings':
        navigation.navigate('Settings');
        break;
      case 'statistics':
        Alert.alert('Bilgi', 'İstatistikler bölümü yakında eklenecek');
        break;
      case 'dataManagement':
        Alert.alert('Bilgi', 'Veri yönetimi bölümü yakında eklenecek');
        break;
      case 'appInfo':
        Alert.alert('Bilgi', 'Uygulama bilgileri bölümü yakında eklenecek');
        break;
      default:
        break;
    }
  };

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
          <View style={styles.headerSpacer} />
          <Text style={styles.title}>Ayarlar</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Ana Menü Butonları */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Profil</Text>
            {menuButtons.map((button, index) => (
              <MenuButton
                key={index}
                {...button}
              />
            ))}
          </View>
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