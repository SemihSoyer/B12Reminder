import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { getFrequencyText } from '../../utils/medicationUtils';
import ReminderIcon from '../common/ReminderIcon';

export default function MedicationList({ medications, onDelete }) {
  const renderItem = ({ item }) => {
    const detailsText = `${item.dosage} • ${item.times.join(', ')} • ${getFrequencyText(item.frequency)}`;
    
    return (
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.details}>{detailsText}</Text>
        </View>
        <ReminderIcon 
          name="medkit-outline" 
          color="#74B9FF" 
          backgroundColor="rgba(116, 185, 255, 0.1)" 
        />
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: spacing.sm,
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
    paddingLeft: spacing.sm, // İkonla arasında boşluk bırakmak için
  },
  separator: {
    height: spacing.sm,
  },
});
