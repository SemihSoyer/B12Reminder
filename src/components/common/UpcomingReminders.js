import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { getResponsiveValue, spacing, fontSizes } from '../../constants/responsive';

export default function UpcomingReminders({ upcomingReminders = [] }) {
  const hasUpcoming = upcomingReminders && upcomingReminders.length > 0;

  if (!hasUpcoming) {
    return null; // Yaklaşan hatırlatma yoksa hiçbir şey gösterme
  }

  const getDaysText = (days) => {
    if (days === 0) return 'Bugün';
    if (days === 1) return 'Yarın';
    return `${days} gün sonra`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Yaklaşan Hatırlatıcılar</Text>
      <View style={styles.listContainer}>
        {upcomingReminders.map((reminder, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.itemContent}>
              <View style={styles.checkbox}>
                <View style={[styles.checkboxInner, { backgroundColor: reminder.categoryColor }]} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{reminder.title}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDate}>{reminder.date}</Text>
                  <View style={styles.separator} />
                  <Text style={styles.itemDays}>{getDaysText(reminder.daysLeft)}</Text>
                </View>
              </View>
              <Text style={styles.itemIcon}>{reminder.icon}</Text>
            </View>
            {index < upcomingReminders.length - 1 && <View style={styles.divider} />}
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
    fontSize: fontSizes.large,
    fontWeight: '600',
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
    fontSize: fontSizes.medium,
    fontWeight: '400',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: fontSizes.small,
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
    fontSize: fontSizes.small,
    color: '#00B894',
    fontWeight: '500',
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
