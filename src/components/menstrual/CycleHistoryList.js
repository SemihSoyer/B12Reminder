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
import { formatDateForDisplay } from '../../utils/menstrualUtils';

export default function CycleHistoryList({ cycles, onDelete }) {
  if (!cycles || cycles.length === 0) {
    return null;
  }

  const renderCycleItem = ({ item, index }) => (
    <View style={styles.cycleItem}>
      <View style={styles.cycleIcon}>
        <Ionicons name="water" size={20} color="#E17055" />
      </View>
      
      <View style={styles.cycleInfo}>
        <Text style={styles.cycleDate}>
          {formatDateForDisplay(item.startDate)}
        </Text>
        <View style={styles.cycleDetails}>
          {item.periodLength && (
            <Text style={styles.cycleDetail}>
              {item.periodLength} days
            </Text>
          )}
          {item.cycleLength && (
            <>
              <View style={styles.separator} />
              <Text style={styles.cycleDetail}>
                Cycle: {item.cycleLength} days
              </Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete && onDelete(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={18} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={20} color="#1a1a1a" />
        <Text style={styles.headerTitle}>Cycle History</Text>
      </View>
      
      <View style={styles.listContainer}>
        <FlatList
          data={cycles}
          renderItem={renderCycleItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cycleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  cycleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(225, 112, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleInfo: {
    flex: 1,
  },
  cycleDate: {
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cycleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cycleDetail: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C7CC',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(199, 199, 204, 0.3)',
    marginHorizontal: spacing.md,
  },
});

