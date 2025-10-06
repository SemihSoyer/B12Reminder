import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function EmptyState({ message, subMessage }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💊</Text>
      <Text style={styles.title}>{message || 'No Medications Yet'}</Text>
      <Text style={styles.subtitle}>
        {subMessage || 'Start tracking your medication by adding your first medication.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    marginVertical: spacing.md,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...FONT_STYLES.body,
    color: '#666',
    textAlign: 'center',
  },
});
