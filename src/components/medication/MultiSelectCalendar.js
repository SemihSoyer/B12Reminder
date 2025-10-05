import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
const DAYS_OF_WEEK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

// Tarihleri YYYY-MM-DD formatına çevirir (Timezone sorununu önler)
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function MultiSelectCalendar({ selectedDates, onSelectionChange }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (amount) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1);
    setCurrentDate(newDate);
  };

  const handleDayPress = (date) => {
    const formattedDate = formatDate(date);
    const newSelection = selectedDates.includes(formattedDate)
      ? selectedDates.filter(d => d !== formattedDate)
      : [...selectedDates, formattedDate];
    onSelectionChange(newSelection);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrow}>
        <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
      </TouchableOpacity>
      <Text style={styles.monthText}>
        {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
      </Text>
      <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrow}>
        <Ionicons name="chevron-forward" size={24} color="#1a1a1a" />
      </TouchableOpacity>
    </View>
  );

  const renderDaysOfWeek = () => (
    <View style={styles.daysOfWeek}>
      {DAYS_OF_WEEK.map(day => (
        <Text key={day} style={styles.dayOfWeekText}>{day}</Text>
      ))}
    </View>
  );

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Haftanın Pzt(1) - Paz(0) formatından Pzt(0) - Paz(6) formatına geçiş
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const formatted = formatDate(dayDate);
      const isSelected = selectedDates.includes(formatted);
      
      days.push(
        <TouchableOpacity
          key={day}
          style={styles.dayContainer}
          onPress={() => handleDayPress(dayDate)}
        >
          <View style={[styles.day, isSelected && styles.selectedDay]}>
            <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return <View style={styles.calendarGrid}>{days}</View>;
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCalendarDays()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.sm,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  arrow: {
    padding: spacing.sm,
  },
  monthText: {
    ...FONT_STYLES.emphasis,
    color: '#1a1a1a',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  dayOfWeekText: {
    ...FONT_STYLES.bodySmall,
    color: '#999',
    width: 32,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: `${100 / 7}%`,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  day: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  dayText: {
    ...FONT_STYLES.body,
    color: '#1a1a1a',
  },
  selectedDay: {
    backgroundColor: '#74B9FF',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
