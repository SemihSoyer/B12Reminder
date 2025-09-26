import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing, fontSizes, getResponsiveValue } from '../../constants/responsive';

// Components
import MonthlyCalendar from '../../components/birthday/MonthlyCalendar';

// Services & Utils
import { BirthdayService, MedicationService } from '../../utils/storage';
import { transformBirthdaysToReminders } from '../../utils/birthdayUtils';
import { transformMedicationsToReminders } from '../../utils/medicationUtils';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadAllEvents();
    }, [])
  );

  const loadAllEvents = async () => {
    try {
      setLoading(true);
      
      // Doğum günü verilerini al
      const birthdays = await BirthdayService.getAllBirthdays();
      
      // İlaç verilerini al
      const medications = await MedicationService.getAllMedications();
      const { todayReminders: medicationToday } = transformMedicationsToReminders(medications);
      
      // Tüm etkinlikleri birleştir
      const combinedEvents = [
        ...birthdays.map(birthday => ({
          ...birthday,
          type: 'birthday',
          color: '#FF6B6B',
          icon: 'gift-outline'
        })),
        ...medications.map(med => ({
          ...med,
          type: 'medication',
          color: '#4A90E2',
          icon: 'medkit-outline'
        }))
      ];
      
      setAllEvents(combinedEvents);
    } catch (error) {
      console.error('Etkinlikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Seçilen tarihteki etkinlikleri filtrele
    const eventsForDate = allEvents.filter(event => {
      if (event.type === 'birthday') {
        // Doğum günü formatı: "15 Ocak"
        const day = date.getDate();
        const month = date.toLocaleDateString('tr-TR', { month: 'long' });
        const expectedDate = `${day} ${month}`;
        return event.date === expectedDate;
      } else if (event.type === 'medication') {
        // İlaç kontrolü - seçilen tarihte alınması gereken mi?
        return isMedicationForSelectedDate(event, date);
      }
      return false;
    });
    
    setSelectedDateEvents(eventsForDate);
  };

  // İlaç hatırlatıcısının seçilen tarihte aktif olup olmadığını kontrol et
  const isMedicationForSelectedDate = (medication, date) => {
    const { frequency, createdAt } = medication;
    if (!frequency) return false;

    const { type, value } = frequency;
    const dayOfWeek = (date.getDay() + 6) % 7; // Pzt=0, Sal=1, ..., Paz=6

    switch (type) {
      case 'daily':
        return true;

      case 'interval':
        if (!createdAt) return false;
        const startDate = new Date(createdAt);
        startDate.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        const diffTime = targetDate - startDate;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 0 && diffDays % value === 0;

      case 'weekly':
        return value.includes(dayOfWeek);

      case 'specific_dates':
        const dateFormatted = date.toISOString().split('T')[0];
        return value.includes(dateFormatted);

      default:
        return false;
    }
  };

  const formatSelectedDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <LinearGradient
      colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Takvim</Text>
            <Text style={styles.subtitle}>Tüm hatırlatıcılarınız</Text>
          </View>

          {/* Calendar */}
          <MonthlyCalendar 
            birthdays={allEvents.filter(e => e.type === 'birthday')}
            medications={allEvents.filter(e => e.type === 'medication')}
            onDateSelect={handleDateSelect}
          />

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendBirthdayDot]} />
              <Text style={styles.legendText}>Doğum Günleri</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendMedicationDot]} />
              <Text style={styles.legendText}>İlaç Hatırlatıcıları</Text>
            </View>
          </View>

        </ScrollView>

        {/* Event Details Modal */}
        <Modal
          visible={selectedDate !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedDate(null)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setSelectedDate(null)}
          >
            <Pressable style={styles.modalContent} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {formatSelectedDate(selectedDate)}
                </Text>
                <TouchableOpacity 
                  onPress={() => setSelectedDate(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {selectedDateEvents.length > 0 ? (
                <ScrollView style={styles.modalEventsContainer}>
                  {selectedDateEvents.map((event, index) => (
                    <View key={index} style={styles.modalEventItem}>
                      <View style={styles.eventIcon}>
                        <Ionicons 
                          name={event.icon} 
                          size={20} 
                          color={event.color} 
                        />
                      </View>
                      <View style={styles.eventDetails}>
                        <Text style={styles.eventTitle}>
                          {event.type === 'birthday' ? `${event.name}'in doğum günü` : event.name}
                        </Text>
                        {event.type === 'medication' && (
                          <Text style={styles.eventSubtitle}>{event.dosage}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noEventsContainer}>
                  <Text style={styles.noEventsText}>
                    Bu tarihte herhangi bir etkinlik yok
                  </Text>
                </View>
              )}
            </Pressable>
          </Pressable>
        </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    marginBottom: spacing.xs,
    fontSize: fontSizes.header,
  },
  subtitle: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
    fontSize: fontSizes.medium,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: getResponsiveValue(spacing.md, spacing.lg, spacing.xl),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: getResponsiveValue(6, 8, 10),
    height: getResponsiveValue(6, 8, 10),
    borderRadius: getResponsiveValue(3, 4, 5),
  },
  legendBirthdayDot: {
    backgroundColor: '#FF6A88',
  },
  legendMedicationDot: {
    backgroundColor: '#4A90E2',
  },
  legendText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    fontSize: fontSizes.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveValue(16, 20, 24),
    padding: spacing.lg,
    width: getResponsiveValue('95%', '90%', '85%'),
    maxHeight: getResponsiveValue('75%', '70%', '65%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveValue(8, 10, 12),
    },
    shadowOpacity: 0.25,
    shadowRadius: getResponsiveValue(16, 20, 24),
    elevation: getResponsiveValue(8, 10, 12),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  modalTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    flex: 1,
    fontSize: fontSizes.large,
  },
  closeButton: {
    width: getResponsiveValue(28, 32, 36),
    height: getResponsiveValue(28, 32, 36),
    borderRadius: getResponsiveValue(14, 16, 18),
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEventsContainer: {
    maxHeight: getResponsiveValue(250, 300, 350),
  },
  modalEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: '#F8F9FA',
    borderRadius: getResponsiveValue(8, 12, 16),
  },
  eventsContainer: {
    gap: spacing.sm,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: getResponsiveValue(8, 12, 16),
    padding: spacing.md,
  },
  eventIcon: {
    width: getResponsiveValue(32, 40, 48),
    height: getResponsiveValue(32, 40, 48),
    borderRadius: getResponsiveValue(16, 20, 24),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
    marginBottom: 2,
    fontSize: fontSizes.medium,
  },
  eventSubtitle: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    fontSize: fontSizes.small,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noEventsText: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
    textAlign: 'center',
    fontSize: fontSizes.medium,
  },
});