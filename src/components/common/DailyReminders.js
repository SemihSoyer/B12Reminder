import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getResponsiveValue, spacing, fontSizes } from '../../constants/responsive';
import { FONT_FAMILIES, FONT_STYLES } from '../../constants/fonts';
import ReminderIcon from './ReminderIcon';

export default function DailyReminders({ reminders = [], onDelete }) {
  const hasReminders = reminders && reminders.length > 0;

  if (!hasReminders) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Bugün</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyText}>Bugün hiçbir şeyi unutmadın!</Text>
          <Text style={styles.emptySubtext}>Harika gidiyor</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bugün ({reminders.length})</Text>
      <View style={styles.listContainer}>
        {reminders.map((reminder, index) => (
          <View key={reminder.id} style={styles.listItem}>
            <View style={styles.itemContent}>
              <View style={styles.checkbox}>
                <View style={[styles.checkboxInner, { backgroundColor: '#FF6A88' }]} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{reminder.title}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTime}>{reminder.time}</Text>
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
  },
  sectionTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    marginBottom: spacing.md,
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#333',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
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
  itemTime: {
    ...FONT_STYLES.emphasisSmall,
    color: '#666',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C7CC',
    marginHorizontal: spacing.xs,
  },
  itemCategory: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
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
