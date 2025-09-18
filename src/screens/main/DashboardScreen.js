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
                  style={styles.reminderCard}
                  onPress={() => handleReminderPress(type.screen)}
                >
                  <View style={styles.reminderCardHeader}>
                    <Text style={styles.reminderIcon}>{type.icon}</Text>
                  </View>
                  <Text style={styles.reminderTitle}>{type.title}</Text>
                  <Text style={styles.reminderDescription}>{type.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reminderCardHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reminderIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  reminderTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  reminderDescription: {
    fontSize: fontSizes.small,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
});