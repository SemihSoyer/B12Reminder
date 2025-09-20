import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { deviceSizes, getResponsiveValue, screenWidth } from '../../constants/responsive';
import { FONT_FAMILIES } from '../../constants/fonts';

export default function WeeklyCalendar() {
  const [weekDays, setWeekDays] = useState([]);

  // Türkçe gün isimleri
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  
  // Haftanın günlerini hesapla ve otomatik güncelle
  useEffect(() => {
    const updateWeekDays = () => {
      const today = new Date();
      
      // Bugünden 3 gün öncesinden başlayarak 7 gün oluştur (bugün ortada)
      const days = [];
      for (let i = -3; i <= 3; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        days.push(day);
      }
      
      setWeekDays(days);
    };

    // İlk yüklemede güncelle
    updateWeekDays();

    // Her gece saat 00:00'da güncelle
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // İlk midnight timer
    const initialTimer = setTimeout(() => {
      updateWeekDays();
      
      // Sonrasında her 24 saatte bir güncelle
      const dailyInterval = setInterval(updateWeekDays, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(initialTimer);
  }, []);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekContainer}>
        {weekDays.map((date, index) => {
          const dayName = dayNames[date.getDay()];
          const dayNumber = date.getDate();
          const isCurrentDay = isToday(date);

          return (
            <View key={index} style={styles.dayContainer}>
              {isCurrentDay ? (
                <LinearGradient
                  colors={['#00B894', '#00CEC9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dayButton}
                >
                  <Text style={[styles.dayName, styles.activeDayName]}>{dayName}</Text>
                  <Text style={[styles.dayNumber, styles.activeDayNumber]}>{dayNumber}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.dayButton}>
                  <Text style={styles.dayName}>{dayName}</Text>
                  <Text style={styles.dayNumber}>{dayNumber}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// Responsive boyutları hesapla
const dayButtonWidth = getResponsiveValue(42, 48, 52);
const dayButtonHeight = getResponsiveValue(60, 68, 72);
const containerPadding = getResponsiveValue(16, 20, 24);
const dayGap = (screenWidth - (containerPadding * 2) - (dayButtonWidth * 7)) / 6;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: containerPadding,
    gap: Math.max(dayGap, 4), // Minimum 4px gap
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayButton: {
    width: dayButtonWidth,
    height: dayButtonHeight,
    borderRadius: dayButtonWidth / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dayName: {
    fontSize: getResponsiveValue(10, 11, 12),
    fontFamily: FONT_FAMILIES.medium,
    color: '#666',
    marginBottom: getResponsiveValue(2, 3, 4),
  },
  activeDayName: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILIES.semiBold,
  },
  dayNumber: {
    fontSize: getResponsiveValue(16, 17, 18),
    fontFamily: FONT_FAMILIES.bold,
    color: '#333',
  },
  activeDayNumber: {
    color: '#FFFFFF',
  },
});
