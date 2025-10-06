import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeekDayPicker({ selectedDays, onDayPress }) {
  return (
    <View style={styles.container}>
      {DAYS.map((day, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <TouchableOpacity
            key={day}
            onPress={() => onDayPress(index)}
            style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
          >
            <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  dayButtonSelected: {
    backgroundColor: '#74B9FF',
  },
  dayText: {
    ...FONT_STYLES.body,
    color: '#333',
  },
  dayTextSelected: {
    ...FONT_STYLES.body,
    color: '#fff',
    fontWeight: 'bold',
  },
});
