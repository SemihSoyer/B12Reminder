import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
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
import { BirthdayService, MedicationService } from '../../utils/storage';
import { transformBirthdaysToReminders } from '../../utils/birthdayUtils';
import { transformMedicationsToReminders } from '../../utils/medicationUtils';

// Data
import { featureCards } from '../../data/featureCards';

export default function DashboardScreen({ navigation }) {
  const [todayReminders, setTodayReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadReminders = async () => {
        try {
          // Doğum günü verilerini al ve işle
          const birthdays = await BirthdayService.getAllBirthdays();
          const { 
            todayReminders: birthdayToday, 
            upcomingReminders: birthdayUpcoming 
          } = transformBirthdaysToReminders(birthdays);

          // İlaç verilerini al ve işle
          const medications = await MedicationService.getAllMedications();
          const {
            todayReminders: medicationToday,
            upcomingReminders: medicationUpcoming
          } = transformMedicationsToReminders(medications);

          // Tüm hatırlatıcıları birleştir ve sırala
          const allToday = [...birthdayToday, ...medicationToday]
            .sort((a, b) => a.time.localeCompare(b.time));
          
          const allUpcoming = [...birthdayUpcoming, ...medicationUpcoming]
            .sort((a, b) => a.daysLeft - b.daysLeft);

          // State'leri güncelle
          setTodayReminders(allToday);
          setUpcomingReminders(allUpcoming);

        } catch (error) {
          console.error("Hatırlatıcılar yüklenirken hata oluştu:", error);
        }
      };

      loadReminders();
    }, [])
  );

  const handleDeleteBirthday = (birthdayId) => {
    Alert.alert(
      'Doğum Gününü Sil',
      'Bu doğum gününü kalıcı olarak silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              await BirthdayService.deleteBirthday(birthdayId);
              // State'i anında güncelle
              setTodayReminders(prev => prev.filter(r => r.originalId !== birthdayId));
              setUpcomingReminders(prev => prev.filter(r => r.originalId !== birthdayId));
            } catch (error) {
              console.error("Doğum günü silinirken hata oluştu:", error);
              Alert.alert('Hata', 'Silme işlemi sırasında bir sorun oluştu.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

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
          
          <DailyReminders reminders={todayReminders} onDelete={handleDeleteBirthday} />
          
          <UpcomingReminders reminders={upcomingReminders} onDelete={handleDeleteBirthday} />
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