import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

// Components
import FeatureCard from '../../components/common/FeatureCard';
import WeeklyCalendar from '../../components/common/WeeklyCalendar';
import DailyReminders from '../../components/common/DailyReminders';
import UpcomingReminders from '../../components/common/UpcomingReminders';

// Services & Utils
import { BirthdayService } from '../../utils/storage';
import { transformBirthdaysToReminders } from '../../utils/birthdayUtils';

// Data
import { featureCards } from '../../data/featureCards';

export default function DashboardScreen({ navigation }) {
  const [todayReminders, setTodayReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadReminders = async () => {
        try {
          // Doğum günü verilerini al
          const birthdays = await BirthdayService.getAllBirthdays();
          
          // Verileri anasayfa formatına dönüştür
          const { 
            todayReminders: birthdayToday, 
            upcomingReminders: birthdayUpcoming 
          } = transformBirthdaysToReminders(birthdays);

          // Diğer hatırlatıcılar (ileride eklenecek)
          const staticToday = []; 
          const staticUpcoming = [];

          // State'leri güncelle
          setTodayReminders([...staticToday, ...birthdayToday]);
          setUpcomingReminders([...staticUpcoming, ...birthdayUpcoming]);

        } catch (error) {
          console.error("Hatırlatıcılar yüklenirken hata oluştu:", error);
        }
      };

      loadReminders();
    }, [])
  );

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
          
          <UpcomingReminders reminders={upcomingReminders} />
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