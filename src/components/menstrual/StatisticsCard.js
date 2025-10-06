import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { calculateCycleRegularity } from '../../utils/menstrualUtils';

export default function StatisticsCard({ menstrualData }) {
  const regularity = calculateCycleRegularity(menstrualData.cycles);
  
  // Sadece geçerli döngü uzunluklarını say (en az 2 döngü gerekli)
  const validCyclesCount = menstrualData.cycles.filter(c => c.cycleLength !== null && c.cycleLength > 0).length;
  const showRegularity = validCyclesCount >= 2;
  
  const getRegularityText = () => {
    if (regularity === null) return 'Data insufficient';
    if (regularity >= 80) return 'Very regular';
    if (regularity >= 60) return 'Regular';
    if (regularity >= 40) return 'Moderate';
    return 'Irregular';
  };

  const getRegularityColor = () => {
    if (regularity === null) return '#95A5A6';
    if (regularity >= 80) return '#00B894';
    if (regularity >= 60) return '#74B9FF';
    if (regularity >= 40) return '#FDCB6E';
    return '#FF6A88';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="stats-chart" size={20} color="#1a1a1a" />
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>
      
      <View style={styles.statsContainer}>
        {/* Ortalama Döngü */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(116, 185, 255, 0.15)' }]}>
            <Ionicons name="repeat" size={24} color="#74B9FF" />
          </View>
          <Text style={styles.statValue}>{menstrualData.averageCycleLength}</Text>
          <Text style={styles.statLabel}>Average Cycle</Text>
          <Text style={styles.statUnit}>gün</Text>
        </View>

        {/* Ortalama Regl Süresi */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(225, 112, 85, 0.15)' }]}>
            <Ionicons name="water" size={24} color="#E17055" />
          </View>
          <Text style={styles.statValue}>{menstrualData.averagePeriodLength}</Text>
          <Text style={styles.statLabel}>Average Period</Text>
          <Text style={styles.statUnit}>gün</Text>
        </View>

        {/* Döngü Sayısı */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(0, 184, 148, 0.15)' }]}>
            <Ionicons name="calendar" size={24} color="#00B894" />
          </View>
          <Text style={styles.statValue}>{menstrualData.cycles.length}</Text>
          <Text style={styles.statLabel}>Recorded Cycle</Text>
          <Text style={styles.statUnit}>adet</Text>
        </View>
      </View>

      {/* Düzenlilik */}
      {showRegularity && regularity !== null && (
        <View style={styles.regularityContainer}>
          <Text style={styles.regularityLabel}>Cycle Regularity</Text>
          <View style={styles.regularityBar}>
            <View 
              style={[
                styles.regularityFill, 
                { 
                  width: `${regularity}%`,
                  backgroundColor: getRegularityColor(),
                }
              ]} 
            />
          </View>
          <Text style={[styles.regularityText, { color: getRegularityColor() }]}>
            {getRegularityText()} ({regularity}%)
          </Text>
        </View>
      )}
      
      {!showRegularity && (
        <View style={styles.regularityContainer}>
          <View style={styles.infoNote}>
            <Ionicons name="information-circle-outline" size={18} color="#74B9FF" />
            <Text style={styles.infoNoteText}>
              To see the regularity score, you need to record at least 2 complete cycles.
            </Text>
          </View>
        </View>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...FONT_STYLES.heading2,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  statLabel: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  statUnit: {
    ...FONT_STYLES.bodySmall,
    color: '#999',
    marginTop: 2,
  },
  regularityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  regularityLabel: {
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
  },
  regularityBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  regularityFill: {
    height: '100%',
    borderRadius: 4,
  },
  regularityText: {
    ...FONT_STYLES.bodySmall,
    textAlign: 'right',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  infoNoteText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
});

