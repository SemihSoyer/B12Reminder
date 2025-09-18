import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSizes, spacing, cardSizes } from '../../constants/responsive';

export default function DashboardScreen({ navigation }) {
  const reminderTypes = [
    {
      id: 'birthday',
      title: 'Doğum Günü Hatırlatıcısı',
      icon: '🎂',
      description: 'Sevdiklerinizin doğum günlerini hatırlayın',
      color: '#FF6B6B',
      screen: 'BirthdayReminder'
    },
    {
      id: 'menstrual',
      title: 'Regl Takibi',
      icon: '📅',
      description: 'Döngünüzü takip edin ve planlayın',
      color: '#FF8E9B',
      screen: 'MenstrualTracking'
    },
    {
      id: 'medication',
      title: 'İlaç Hatırlatma',
      icon: '💊',
      description: 'İlaç saatlerinizi kaçırmayın',
      color: '#4ECDC4',
      screen: 'MedicationReminder'
    },
    {
      id: 'custom',
      title: 'Özel Hatırlatıcılar',
      icon: '⏰',
      description: 'Kişiselleştirilmiş hatırlatıcılar',
      color: '#45B7D1',
      screen: 'CustomReminders'
    }
  ];

  const handleReminderPress = (screen) => {
    navigation.navigate(screen);
  };

  const handlePaywallPress = () => {
    navigation.navigate('Paywall');
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Merhaba! 👋</Text>
            <Text style={styles.subtitle}>Bugün hangi hatırlatıcıyı kurmak istiyorsunuz?</Text>
          </View>

          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>Yaklaşan Hatırlatıcılar</Text>
            <View style={styles.upcomingCard}>
              <Text style={styles.upcomingText}>Henüz yaklaşan hatırlatıcınız yok</Text>
              <Text style={styles.upcomingSubtext}>Hatırlatıcı ekleyerek başlayın!</Text>
            </View>
          </View>

          <View style={styles.reminderTypesSection}>
            <Text style={styles.sectionTitle}>Hatırlatıcı Türleri</Text>
            <View style={styles.reminderGrid}>
              {reminderTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.reminderCard, { borderLeftColor: type.color }]}
                  onPress={() => handleReminderPress(type.screen)}
                >
                  <View style={styles.reminderCardHeader}>
                    <Text style={styles.reminderIcon}>{type.icon}</Text>
                    <View style={[styles.reminderBadge, { backgroundColor: type.color }]} />
                  </View>
                  <Text style={styles.reminderTitle}>{type.title}</Text>
                  <Text style={styles.reminderDescription}>{type.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.premiumBanner} onPress={handlePaywallPress}>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumIcon}>✨</Text>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Premium Özellikler</Text>
                <Text style={styles.premiumSubtitle}>Sınırsız hatırlatıcı ve daha fazlası</Text>
              </View>
              <Text style={styles.premiumArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: '#fff',
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: '#666',
  },
  upcomingSection: {
    padding: spacing.lg,
    backgroundColor: '#fff',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.md,
  },
  upcomingCard: {
    backgroundColor: '#f8f9fa',
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  upcomingText: {
    fontSize: fontSizes.medium,
    color: '#666',
    marginBottom: spacing.xs,
  },
  upcomingSubtext: {
    fontSize: fontSizes.small,
    color: '#999',
  },
  reminderTypesSection: {
    padding: spacing.lg,
    backgroundColor: '#fff',
    marginBottom: spacing.lg,
  },
  reminderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reminderCard: {
    width: cardSizes.reminderCard.width,
    minHeight: cardSizes.reminderCard.minHeight,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reminderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reminderIcon: {
    fontSize: 24,
  },
  reminderBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reminderTitle: {
    fontSize: fontSizes.small,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  reminderDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  premiumBanner: {
    margin: spacing.lg,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  premiumIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: fontSizes.small,
    color: '#B3D9FF',
  },
  premiumArrow: {
    fontSize: 20,
    color: '#fff',
  },
});