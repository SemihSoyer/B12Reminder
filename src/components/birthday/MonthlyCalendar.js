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
import { spacing, fontSizes, getResponsiveValue } from '../../constants/responsive';

export default function MonthlyCalendar({ birthdays = [], medications = [], onDateSelect }) {
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

  // Bu tarihte kaç doğum günü var kontrol et
  const getBirthdayCount = (date) => {
    if (!birthdays || !Array.isArray(birthdays)) {
      return 0;
    }

    const count = birthdays.filter(birthday => {
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
    }).length;

    return count;
  };

  // Bu tarihte doğum günü var mı kontrol et (geriye uyumluluk için)
  const hasBirthday = (date) => {
    return getBirthdayCount(date) > 0;
  };

  // İlaç hatırlatıcısı kontrolü için yardımcı fonksiyon
  const isMedicationForDate = (medication, date) => {
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

  // Bu tarihte kaç ilaç hatırlatıcısı var kontrol et
  const getMedicationCount = (date) => {
    if (!medications || !Array.isArray(medications)) {
      return 0;
    }

    return medications.filter(med => isMedicationForDate(med, date)).length;
  };

  // Etkinlik noktaları gösterimi (doğum günü + ilaç)
  const renderEventIndicators = (birthdayCount, medicationCount, isToday = false) => {
    const totalCount = birthdayCount + medicationCount;
    if (totalCount === 0) return null;
    
    const dots = [];
    const containerStyle = isToday ? styles.todayEventIndicators : styles.eventIndicators;
    
    // Doğum günü noktaları (kırmızı)
    for (let i = 0; i < Math.min(birthdayCount, 2); i++) {
      dots.push(
        <View
          key={`birthday-${i}`}
          style={[
            isToday ? styles.todayEventDot : styles.eventDot, 
            styles.birthdayDot,
            isToday && { backgroundColor: '#FF6A88' }
          ]}
        />
      );
    }
    
    // İlaç noktaları (mavi)
    for (let i = 0; i < Math.min(medicationCount, 2); i++) {
      dots.push(
        <View
          key={`medication-${i}`}
          style={[
            isToday ? styles.todayEventDot : styles.eventDot, 
            styles.medicationDot,
            isToday && { backgroundColor: '#4A90E2' }
          ]}
        />
      );
    }
    
    // Maksimum 3 nokta göster
    const displayDots = dots.slice(0, 3);
    
    return (
      <View style={containerStyle}>
        {displayDots}
      </View>
    );
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
            const birthdayCount = getBirthdayCount(dayObj.date);
            const medicationCount = getMedicationCount(dayObj.date);
            const hasAnyEvent = birthdayCount > 0 || medicationCount > 0;
            
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
                onPress={() => onDateSelect && onDateSelect(dayObj.date)}
                activeOpacity={0.7}
              >
                {isCurrentDay ? (
                  <View style={[styles.dayButton, styles.todayButton]}>
                    <Text style={[styles.dayText, styles.todayText]}>
                      {dayObj.day}
                    </Text>
                    {hasAnyEvent && renderEventIndicators(birthdayCount, medicationCount, true)}
                  </View>
                ) : hasAnyEvent ? (
                  <View style={[
                    styles.dayButton, 
                    birthdayCount > 0 && medicationCount > 0 ? styles.mixedEventDay :
                    birthdayCount > 0 ? styles.birthdayDay : styles.medicationDay
                  ]}>
                    <Text style={[
                      styles.dayText, 
                      birthdayCount > 0 && medicationCount > 0 ? styles.mixedEventText :
                      birthdayCount > 0 ? styles.birthdayText : styles.medicationText
                    ]}>
                      {dayObj.day}
                    </Text>
                    {renderEventIndicators(birthdayCount, medicationCount)}
                  </View>
                ) : (
                  <View style={styles.dayButton}>
                    <Text style={styles.dayText}>
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
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveValue(12, 16, 20),
    padding: spacing.lg,
    marginVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveValue(2, 4, 6),
    },
    shadowOpacity: 0.08,
    shadowRadius: getResponsiveValue(12, 16, 20),
    elevation: getResponsiveValue(3, 4, 5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  navButton: {
    width: getResponsiveValue(28, 32, 36),
    height: getResponsiveValue(28, 32, 36),
    borderRadius: getResponsiveValue(6, 8, 10),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: fontSizes.large,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  dayNameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayName: {
    ...FONT_STYLES.emphasisSmall,
    color: '#9AA0A6',
    fontWeight: '500',
    fontSize: fontSizes.small,
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: '14.28%', // 7 gün için
    aspectRatio: 1,
    padding: getResponsiveValue(1, 2, 3),
  },
  dayButton: {
    flex: 1,
    borderRadius: getResponsiveValue(6, 8, 10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  dayText: {
    ...FONT_STYLES.bodyMedium,
    color: '#3C4043',
    fontWeight: '400',
    fontSize: fontSizes.medium,
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  otherMonthText: {
    color: '#DADCE0',
  },
  todayButton: {
    backgroundColor: '#4285F4',
  },
  todayEventIndicators: {
    position: 'absolute',
    bottom: getResponsiveValue(2, 4, 6),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: getResponsiveValue(1, 2, 3),
  },
  todayEventDot: {
    width: getResponsiveValue(3, 4, 5),
    height: getResponsiveValue(3, 4, 5),
    borderRadius: getResponsiveValue(1.5, 2, 2.5),
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  birthdayDay: {
    backgroundColor: 'transparent',
  },
  birthdayText: {
    color: '#3C4043',
    fontWeight: '400',
  },
  medicationDay: {
    backgroundColor: 'transparent',
  },
  medicationText: {
    color: '#3C4043',
    fontWeight: '400',
  },
  mixedEventDay: {
    backgroundColor: 'transparent',
  },
  mixedEventText: {
    color: '#3C4043',
    fontWeight: '400',
  },
  eventDay: {
    backgroundColor: 'transparent',
  },
  eventText: {
    color: '#3C4043',
    fontWeight: '400',
  },
  eventIndicators: {
    position: 'absolute',
    bottom: getResponsiveValue(2, 4, 6),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: getResponsiveValue(1, 2, 3),
  },
  eventDot: {
    width: getResponsiveValue(3, 4, 5),
    height: getResponsiveValue(3, 4, 5),
    borderRadius: getResponsiveValue(1.5, 2, 2.5),
  },
  birthdayDot: {
    backgroundColor: '#FF6A88',
  },
  medicationDot: {
    backgroundColor: '#4A90E2',
  },
});
