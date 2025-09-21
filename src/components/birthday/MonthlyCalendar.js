import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function MonthlyCalendar({ birthdays = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Bugünü kontrol et
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Bu tarihte doğum günü var mı kontrol et
  const hasBirthday = (date) => {
    if (!birthdays || !Array.isArray(birthdays)) {
      return false;
    }

    return birthdays.some(birthday => {
      // Null/undefined kontrolü
      if (!birthday || !birthday.date || typeof birthday.date !== 'string') {
        return false;
      }

      try {
        // Tarih karşılaştırması
        const day = date.getDate();
        const month = date.getMonth();
        const monthName = monthNames[month];
        
        // "15 Ocak" formatında kontrol et
        const expectedDateString = `${day} ${monthName}`;
        return birthday.date.trim() === expectedDateString;
      } catch (error) {
        console.warn('Error checking birthday for date:', error);
        return false;
      }
    });
  };

  const days = getDaysInMonth();

  return (
    <View style={styles.container}>
      {/* Header - Ay Navigasyonu */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={goToPreviousMonth}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#FF6A88" />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={goToNextMonth}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color="#FF6A88" />
        </TouchableOpacity>
      </View>

      {/* Gün İsimleri */}
      <View style={styles.dayNamesRow}>
        {dayNames.map((dayName, index) => (
          <View key={index} style={styles.dayNameContainer}>
            <Text style={styles.dayName}>{dayName}</Text>
          </View>
        ))}
      </View>

      {/* Takvim Grid */}
      <View style={styles.calendarGrid}>
        {days.map((dayObj, index) => {
          const isCurrentDay = isToday(dayObj.date);
          const hasBirthdayToday = hasBirthday(dayObj.date);
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.dayContainer}
              onPress={() => onDateSelect && onDateSelect(dayObj.date)}
              activeOpacity={0.7}
            >
              {isCurrentDay ? (
                <LinearGradient
                  colors={['#FF9A8B', '#FF6A88']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dayButton}
                >
                  <Text style={[styles.dayText, styles.todayText]}>
                    {dayObj.day}
                  </Text>
                </LinearGradient>
              ) : hasBirthdayToday ? (
                <View style={[styles.dayButton, styles.birthdayDay]}>
                  <Text style={[styles.dayText, styles.birthdayText]}>
                    {dayObj.day}
                  </Text>
                  <View style={styles.birthdayIndicator} />
                </View>
              ) : (
                <View style={styles.dayButton}>
                  <Text style={[
                    styles.dayText,
                    !dayObj.isCurrentMonth && styles.otherMonthText
                  ]}>
                    {dayObj.day}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: spacing.md,
    marginVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 106, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
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
  },
  dayContainer: {
    width: '14.28%', // 7 gün için
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  dayText: {
    ...FONT_STYLES.bodyMedium,
    color: '#333',
  },
  todayText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  otherMonthText: {
    color: '#ccc',
  },
  birthdayDay: {
    backgroundColor: 'rgba(255, 106, 136, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 136, 0.3)',
  },
  birthdayText: {
    color: '#FF6A88',
    fontFamily: 'Poppins_600SemiBold',
  },
  birthdayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF6A88',
  },
});
