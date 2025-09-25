import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getResponsiveValue, spacing, fontSizes } from '../../constants/responsive';
import { FONT_FAMILIES, FONT_STYLES } from '../../constants/fonts';
import ReminderIcon from './ReminderIcon';

export default function UpcomingReminders({ reminders = [], onDelete }) {
  const hasUpcoming = reminders && reminders.length > 0;

  if (!hasUpcoming) {
    return null; // Yaklaşan hatırlatma yoksa hiçbir şey gösterme
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Yaklaşan Hatırlatıcılar</Text>
      <View style={styles.listContainer}>
        {reminders.map((reminder, index) => (
          <View key={reminder.id} style={styles.listItem}>
            <View style={styles.itemContent}>
              <View style={styles.checkbox}>
                <View style={[styles.checkboxInner, { backgroundColor: '#00B894' }]} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{reminder.title}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDate}>{reminder.time}</Text>
                  <View style={styles.separator} />
                  <Text style={styles.itemDays}>{reminder.details}</Text>
                </View>
              </View>
              <ReminderIcon {...reminder.iconConfig} />
              <TouchableOpacity onPress={() => onDelete(reminder.originalId, reminder.reminderType)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color="#FF6A88" />
              </TouchableOpacity>
            </View>
            {index < reminders.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // Tab bar için alan
  },
  sectionTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    marginBottom: spacing.md,
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  listItem: {
    paddingHorizontal: spacing.md,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E7',
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDate: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C7CC',
    marginHorizontal: spacing.xs,
  },
  itemDays: {
    ...FONT_STYLES.emphasisSmall,
    color: '#00B894',
  },
  itemIcon: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(199, 199, 204, 0.3)',
    marginLeft: 44, // checkbox + margin genişliği
  },
});
