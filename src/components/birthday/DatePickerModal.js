import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function DatePickerModal({ 
  visible, 
  onClose, 
  onDateSelect,
  initialDate = null 
}) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  // Türkçe ay isimleri
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Türkçe gün isimleri
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Önceki aya git
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Sonraki aya git
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Ayın günlerini hesapla
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Ayın ilk günü
    const firstDay = new Date(year, month, 1);
    // Ayın son günü
    const lastDay = new Date(year, month + 1, 0);
    
    // İlk günün haftanın hangi günü olduğunu bul (Pazartesi = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6; // Pazar için düzeltme
    
    const daysInMonth = lastDay.getDate();
    const days = [];
    
    // Önceki ayın son günlerini ekle
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }
    
    // Bu ayın günlerini ekle
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }
    
    // Sonraki ayın ilk günlerini ekle (42 güne tamamla - 6 hafta)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const dateString = `${day} ${monthNames[month]}`;
    
    onDateSelect(date, dateString);
    onClose();
  };

  const days = getDaysInMonth();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>İptal</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Tarih Seç</Text>
          
          <View style={styles.headerSpacer} />
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          {/* Month Navigation */}
          <View style={styles.monthHeader}>
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={goToPreviousMonth}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#FF6A88" />
            </TouchableOpacity>
            
            <Text style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={goToNextMonth}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={24} color="#FF6A88" />
            </TouchableOpacity>
          </View>

          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((dayName, index) => (
              <View key={index} style={styles.dayNameContainer}>
                <Text style={styles.dayName}>{dayName}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((dayObj, index) => {
              // Diğer ayların günlerini gösterme
              if (!dayObj.isCurrentMonth) {
                return (
                  <View key={index} style={styles.dayContainer}>
                    <View style={styles.dayButton}>
                      {/* Boş alan - diğer ayların günleri gösterilmez */}
                    </View>
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.dayContainer}
                  onPress={() => handleDateSelect(dayObj.date)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dayButton}>
                    <Text style={styles.dayText}>
                      {dayObj.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  closeText: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
  },
  title: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 60,
  },
  calendarContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 106, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    ...FONT_STYLES.heading2,
    color: '#1a1a1a',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    paddingVertical: spacing.sm,
  },
  dayNameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dayName: {
    ...FONT_STYLES.emphasisSmall,
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dayContainer: {
    width: '14.28%', // 7 gün için
    aspectRatio: 1,
    padding: 4,
  },
  dayButton: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dayText: {
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
  },
});
