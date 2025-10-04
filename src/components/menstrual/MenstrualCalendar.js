import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { isDateInPeriod, isDateInFertileWindow } from '../../utils/menstrualUtils';

const { width } = Dimensions.get('window');
const DAY_SIZE = (width - 40 - spacing.lg * 6) / 7;

export default function MenstrualCalendar({ 
  menstrualData, 
  fertileWindow,
  onDatePress 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Pazartesi = 0, Pazar = 6 olacak şekilde ayarla
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const days = [];
    
    // Önceki aydan günler
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }
    
    // Mevcut ayın günleri
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }
    
    // Sonraki aydan günler (6 satır = 42 gün için)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      });
    }
    
    return days;
  };

  const getDayStyle = (day) => {
    if (!day.isCurrentMonth) return null;
    
    const dateStr = day.fullDate.toISOString().split('T')[0];
    
    // Regl dönemi kontrolü
    if (menstrualData.lastPeriodStart) {
      if (isDateInPeriod(dateStr, menstrualData.lastPeriodStart, menstrualData.averagePeriodLength)) {
        return { backgroundColor: '#E17055', color: '#FFFFFF' };
      }
    }
    
    // Verimli dönem kontrolü
    if (fertileWindow && isDateInFertileWindow(dateStr, fertileWindow)) {
      return { backgroundColor: '#00B894', color: '#FFFFFF' };
    }
    
    // Bugün
    const today = new Date();
    if (day.fullDate.toDateString() === today.toDateString()) {
      return { borderColor: '#00CEC9', borderWidth: 2, color: '#00CEC9' };
    }
    
    return null;
  };

  const days = getDaysInMonth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* Gün başlıkları */}
      <View style={styles.weekDays}>
        {dayNames.map((day) => (
          <View key={day} style={styles.weekDayContainer}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Günler */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          const dayStyle = getDayStyle(day);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                !day.isCurrentMonth && styles.inactiveDayContainer,
                dayStyle && { ...dayStyle },
              ]}
              onPress={() => day.isCurrentMonth && onDatePress && onDatePress(day.fullDate)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.isCurrentMonth && styles.inactiveDayText,
                  dayStyle?.color && { color: dayStyle.color },
                ]}
              >
                {day.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lejant */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#E17055' }]} />
          <Text style={styles.legendText}>Regl Dönemi</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#00B894' }]} />
          <Text style={styles.legendText}>Verimli Dönem</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayContainer: {
    width: DAY_SIZE,
    alignItems: 'center',
    marginHorizontal: spacing.xs / 2,
  },
  weekDayText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs / 4,
    marginHorizontal: spacing.xs / 2,
    borderRadius: DAY_SIZE / 2,
  },
  inactiveDayContainer: {
    opacity: 0.3,
  },
  dayText: {
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
  },
  inactiveDayText: {
    color: '#999',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
  },
});

