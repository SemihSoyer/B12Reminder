import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import ReminderIcon from '../common/ReminderIcon';
import { showAlert } from '../ui/CustomAlert';
import { formatDate } from '../../utils/customReminderUtils';

export default function CustomReminderList({ reminders = [], onDelete }) {
  const handleDeletePress = (item) => {
    showAlert(
      'Custom Reminder Delete',
      `"${item.title}" custom reminder to delete?`,
      'warning',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(item),
        },
      ]
    );
  };

  const renderReminderItem = ({ item, index }) => (
    <View style={styles.listItem}>
      <View style={styles.itemContent}>
        <View style={styles.checkbox}>
          <View style={[styles.checkboxInner, { backgroundColor: '#A29BFE' }]} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
            <View style={styles.separator} />
            <Text style={styles.itemTime}>{item.time}</Text>
            <View style={styles.separator} />
            <Text style={styles.daysText}>
              {item.daysLeft === 0 ? 'Today!' : `${item.daysLeft} days left`}
            </Text>
          </View>
          {item.note && item.note.trim() && (
            <Text style={styles.itemNote}>{item.note}</Text>
          )}
        </View>
        <ReminderIcon 
          name="notifications" 
          color="#A29BFE" 
          backgroundColor="rgba(162, 155, 254, 0.1)" 
        />
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeletePress(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#FF4444" />
        </TouchableOpacity>
      </View>
      {index < reminders.length - 1 && <View style={styles.divider} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={reminders}
          renderItem={renderReminderItem}
          keyExtractor={(item, index) => `custom-reminder-${index}`}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexWrap: 'wrap',
  },
  itemDate: {
    ...FONT_STYLES.emphasisSmall,
    color: '#666',
  },
  itemTime: {
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
  daysText: {
    ...FONT_STYLES.bodySmall,
    color: '#A29BFE',
  },
  itemNote: {
    ...FONT_STYLES.bodySmall,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(199, 199, 204, 0.3)',
    marginLeft: 44,
  },
});


