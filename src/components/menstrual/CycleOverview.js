import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { daysUntilNextPeriod, formatDateForDisplay } from '../../utils/menstrualUtils';

export default function CycleOverview({ nextPeriodDate, currentPhase }) {
  const daysUntil = daysUntilNextPeriod(nextPeriodDate);
  
  const getMessage = () => {
    if (!nextPeriodDate || daysUntil === null) {
      return 'Regl takibine başlamak için son regl tarihinizi ekleyin';
    }
    
    if (daysUntil === 0) {
      return 'Bugün regl başlangıcı bekleniyor';
    }
    
    if (daysUntil === 1) {
      return 'Yarın regl başlangıcı bekleniyor';
    }
    
    if (daysUntil === -1) {
      return 'Regl 1 gün gecikmiş';
    }
    
    if (daysUntil < 0) {
      return `Regl ${Math.abs(daysUntil)} gün gecikmiş`;
    }
    
    if (daysUntil === 2) {
      return 'Sonraki regl 2 gün içinde';
    }
    
    if (daysUntil <= 7) {
      return `Sonraki regl ${daysUntil} gün içinde`;
    }
    
    return `Sonraki regl ${daysUntil} gün sonra`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00B894', '#00CEC9', '#81ECEC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Ana Bilgi */}
          <View style={styles.mainInfo}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Döngü Durumu</Text>
              <Text style={styles.message}>{getMessage()}</Text>
            </View>
          </View>

          {/* Tarih Bilgisi */}
          {nextPeriodDate && (
            <View style={styles.dateInfo}>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.dateLabel}>Sonraki Regl</Text>
              </View>
              <Text style={styles.dateValue}>
                {formatDateForDisplay(nextPeriodDate)}
              </Text>
            </View>
          )}

          {/* Faz Bilgisi */}
          {currentPhase && currentPhase.phase !== 'none' && (
            <View style={styles.phaseInfo}>
              <View style={[styles.phaseIndicator, { backgroundColor: currentPhase.color }]}>
                <Ionicons name={currentPhase.icon} size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.phaseText}>{currentPhase.description}</Text>
              {currentPhase.dayOfCycle && (
                <Text style={styles.dayText}>Döngü Günü: {currentPhase.dayOfCycle}</Text>
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00B894',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  gradient: {
    padding: spacing.lg,
  },
  content: {
    gap: spacing.md,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  message: {
    ...FONT_STYLES.bodyMedium,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
  },
  dateInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateLabel: {
    ...FONT_STYLES.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dateValue: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: spacing.sm,
  },
  phaseIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    ...FONT_STYLES.bodyMedium,
    color: '#FFFFFF',
    flex: 1,
  },
  dayText: {
    ...FONT_STYLES.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

