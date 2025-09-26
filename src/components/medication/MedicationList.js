import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { getFrequencyText } from '../../utils/medicationUtils';

const MedicationItem = ({ item, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemIcon}>
        <Ionicons name="medical-outline" size={24} color="#E17055" />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemInfo}>
          {`${item.dosage} • ${item.time}`}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color="#d63031" />
      </TouchableOpacity>
    </View>
  );
};

const MedicationList = ({ medications, onDelete }) => {
  if (!medications || medications.length === 0) {
    return null;
  }

  const renderSectionHeader = ({ section: { title, icon } }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color="#636e72" style={styles.sectionIcon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SectionList
      sections={medications}
      keyExtractor={(item, index) => item.id + index}
      renderItem={({ item }) => <MedicationItem item={item} onDelete={onDelete} />}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      stickySectionHeadersEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...FONT_STYLES.heading3,
    color: '#2d3436',
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(225, 112, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...FONT_STYLES.emphasis,
    fontSize: 16,
    color: '#2d3436',
    marginBottom: spacing.xs,
  },
  itemInfo: {
    ...FONT_STYLES.body,
    color: '#636e72',
    flexWrap: 'wrap',
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
  },
  separator: {
    height: spacing.md,
  },
});

export default MedicationList;
