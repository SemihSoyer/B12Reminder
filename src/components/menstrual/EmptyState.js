import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="calendar-outline" size={48} color="#00B894" />
        </View>
        <Text style={styles.emptyTitle}>Regl Takibine Başlayın</Text>
        <Text style={styles.emptySubtitle}>
          Son regl tarihinizi ekleyerek döngünüzü{'\n'}
          takip etmeye başlayabilirsiniz.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    width: '100%',
    maxWidth: 350,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(0, 184, 148, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...FONT_STYLES.heading2,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

