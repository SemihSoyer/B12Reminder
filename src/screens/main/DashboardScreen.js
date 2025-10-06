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
import { BirthdayService, MedicationService, CustomReminderService } from '../../utils/storage';
import { transformBirthdaysToReminders } from '../../utils/birthdayUtils';
import { transformMedicationsToReminders } from '../../utils/medicationUtils';
import { transformCustomRemindersToReminders } from '../../utils/customReminderUtils';

// Data
import { featureCards } from '../../data/featureCards';
import { showAlert } from '../../components/ui/CustomAlert';

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

          // Özel hatırlatıcıları al ve işle
          const customReminders = await CustomReminderService.getAllReminders();
          const {
            todayReminders: customToday,
            upcomingReminders: customUpcoming
          } = transformCustomRemindersToReminders(customReminders);

          // Tüm hatırlatıcıları birleştir ve sırala
          const allToday = [...birthdayToday, ...medicationToday, ...customToday]
            .sort((a, b) => a.time.localeCompare(b.time));
          
          const allUpcoming = [...birthdayUpcoming, ...medicationUpcoming, ...customUpcoming]
            .sort((a, b) => a.daysLeft - b.daysLeft);

          // State'leri güncelle
          setTodayReminders(allToday);
          setUpcomingReminders(allUpcoming);

        } catch (error) {
          console.error("Error loading reminders:", error);
        }
      };

      loadReminders();
    }, [])
  );

  const handleDeleteReminder = (id, type) => {
    let title = 'Delete Reminder';
    if (type === 'birthday') {
      title = 'Delete Birthday';
    } else if (type === 'medication') {
      title = 'Delete Medication';
    } else if (type === 'custom') {
      title = 'Delete Custom Reminder';
    }
    
    const message = `Are you sure you want to permanently delete this reminder?`;

    showAlert(
      title,
      message,
      'warning',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (type === 'birthday') {
                await BirthdayService.deleteBirthday(id);
              } else if (type === 'medication') {
                await MedicationService.deleteMedication(id);
              } else if (type === 'custom') {
                await CustomReminderService.deleteReminder(id);
              }
              // State'i anında güncelle
              setTodayReminders(prev => prev.filter(r => r.originalId !== id));
              setUpcomingReminders(prev => prev.filter(r => r.originalId !== id));
            } catch (error) {
              console.error("Error deleting reminder:", error);
              showAlert('Error', 'An error occurred while deleting the reminder.', 'error');
            }
          },
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
          
          <DailyReminders reminders={todayReminders} onDelete={handleDeleteReminder} />
          
          <UpcomingReminders reminders={upcomingReminders} onDelete={handleDeleteReminder} />
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