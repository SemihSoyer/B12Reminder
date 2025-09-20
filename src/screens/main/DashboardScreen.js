import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeatureCard from '../../components/common/FeatureCard';
import WeeklyCalendar from '../../components/common/WeeklyCalendar';
import DailyReminders from '../../components/common/DailyReminders';
import UpcomingReminders from '../../components/common/UpcomingReminders';

export default function DashboardScreen({ navigation }) {
  const featureCards = [
    {
      id: 'birthday',
      icon: 'gift-outline',
      iconType: 'ionicon',
      title: 'Doğum Günü',
      gradientColors: ['#FF9A8B', '#FF6A88', '#FF99AC'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#FFFFFF',
      screen: 'BirthdayReminder'
    },
    {
      id: 'medication',
      icon: 'medical-outline',
      iconType: 'ionicon',
      title: 'İlaçlar',
      gradientColors: ['#A8EDEA', '#74B9FF', '#0984E3'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#FFFFFF',
      screen: 'MedicationReminder'
    },
    {
      id: 'custom',
      icon: 'flash-outline',
      iconType: 'ionicon',
      title: 'Özel',
      gradientColors: ['#D63031', '#E84393', '#A29BFE'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#FFFFFF',
      screen: 'CustomReminders'
    },
    {
      id: 'menstrual',
      icon: 'calendar-outline',
      iconType: 'ionicon',
      title: 'Regl Takip',
      gradientColors: ['#00B894', '#00CEC9', '#81ECEC'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#FFFFFF',
      screen: 'MenstrualTracking'
    }
  ];

  // Test amaçlı bugünkü hatırlatıcılar
  const todayReminders = [
    {
      icon: '💊',
      title: 'B12 Vitamini Al',
      time: '08:00',
      category: 'İlaç',
      categoryColor: '#74B9FF',
      gradientColors: ['#DDD6FE', '#E0E7FF']
    },
    {
      icon: '🎂',
      title: 'Ahmet\'in Doğum Günü',
      time: '14:00',
      category: 'Doğum Günü',
      categoryColor: '#FF6B8A',
      gradientColors: ['#FECACA', '#FED7E2']
    }
  ];

  // Test amaçlı yaklaşan hatırlatıcılar
  const upcomingReminders = [
    {
      icon: '💊',
      title: 'Omega-3 Takviyesi',
      date: '22 Aralık, Pazar',
      daysLeft: 2,
      categoryColor: '#74B9FF'
    },
    {
      icon: '🩺',
      title: 'Doktor Randevusu',
      date: '25 Aralık, Çarşamba',
      daysLeft: 5,
      categoryColor: '#00B894'
    },
    {
      icon: '🎂',
      title: 'Ayşe\'nin Doğum Günü',
      date: '28 Aralık, Cumartesi',
      daysLeft: 8,
      categoryColor: '#FF6B8A'
    }
  ];

  const handleCardPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsSection}>
            <View style={styles.cardsGrid}>
              {featureCards.map((card) => (
                <FeatureCard
                  key={card.id}
                  icon={card.icon}
                  iconType={card.iconType}
                  title={card.title}
                  gradientColors={card.gradientColors}
                  iconBackgroundColor={card.iconBackgroundColor}
                  iconColor={card.iconColor}
                  onPress={() => handleCardPress(card.screen)}
                />
              ))}
            </View>
          </View>

          <WeeklyCalendar />
          
          <DailyReminders reminders={todayReminders} />
          
          <UpcomingReminders upcomingReminders={upcomingReminders} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 100, // Custom tab bar için alan bırak
  },
  scrollView: {
    flex: 1,
  },
  cardsSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});