import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getResponsiveValue, spacing, fontSizes } from '../../constants/responsive';

export default function DailyReminders({ reminders = [] }) {
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
          <View key={index} style={styles.listItem}>
            <View style={styles.itemContent}>
              <View style={styles.checkbox}>
                <View style={[styles.checkboxInner, { backgroundColor: reminder.categoryColor }]} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{reminder.title}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTime}>{reminder.time}</Text>
                  <View style={styles.separator} />
                  <Text style={styles.itemCategory}>{reminder.category}</Text>
                </View>
              </View>
              <Text style={styles.itemIcon}>{reminder.icon}</Text>
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
    fontSize: fontSizes.large,
    fontWeight: '600',
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
    fontSize: fontSizes.medium,
    fontWeight: '500',
    color: '#333',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSizes.small,
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
    fontSize: fontSizes.medium,
    fontWeight: '400',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTime: {
    fontSize: fontSizes.small,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C7CC',
    marginHorizontal: spacing.xs,
  },
  itemCategory: {
    fontSize: fontSizes.small,
    color: '#666',
  },
  itemIcon: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(199, 199, 204, 0.3)',
    marginLeft: 44, // checkbox + margin genişliği
  },
});
