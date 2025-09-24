import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { getFrequencyText } from '../../utils/medicationUtils';

export default function MedicationList({ medications, onDelete }) {
  const renderItem = ({ item }) => {
    const detailsText = `${item.dosage} • ${item.times.join(', ')} • ${getFrequencyText(item.frequency)}`;
    
    return (
      <View style={styles.itemContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💊</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.details}>{detailsText}</Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={22} color="#FF6A88" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={medications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(116, 185, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    ...FONT_STYLES.bodyLarge,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  details: {
    ...FONT_STYLES.body,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  separator: {
    height: spacing.sm,
  },
});
