import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import SettingItem from './SettingItem';

export default function SettingsSection({ title, items = [] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <SettingItem
            key={index}
            {...item}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#636e72',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  itemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
