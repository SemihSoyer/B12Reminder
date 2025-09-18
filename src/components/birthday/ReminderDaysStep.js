import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { fontSizes, spacing } from '../../constants/responsive';
import { ReminderDayOptions } from '../../types/birthday';

export default function ReminderDaysStep({ formData, updateFormData, onNext }) {
  const handleDayToggle = (dayValue) => {
    const currentDays = formData.reminderDays || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort((a, b) => a - b);
    
    updateFormData({ reminderDays: newDays });
  };

  const handleContinue = () => {
    if (formData.reminderDays && formData.reminderDays.length > 0) {
      onNext();
    }
  };

  const canContinue = formData.reminderDays && formData.reminderDays.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hatırlatma Zamanı</Text>
        <Text style={styles.subtitle}>
          Doğum gününden kaç gün önce hatırlatılmak istiyorsunuz?
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hatırlatma Günleri</Text>
          
          {ReminderDayOptions.map((option) => {
            const isSelected = formData.reminderDays?.includes(option.value);
            
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOptionButton
                ]}
                onPress={() => handleDayToggle(option.value)}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionLabel,
                    isSelected && styles.selectedOptionLabel
                  ]}>
                    {option.label}
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  isSelected && styles.checkedCheckbox
                ]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {canContinue && (
          <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>⏰</Text>
              <Text style={styles.summaryText}>
                {formData.reminderDays.length} farklı zamanda hatırlatılacaksınız
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={[
            styles.continueButtonText,
            !canContinue && styles.continueButtonTextDisabled
          ]}>
            {canContinue ? 'Devam Et →' : 'En az bir seçenek seçin'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: spacing.sm,
    padding: spacing.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontWeight: '500',
    color: '#333',
    marginBottom: spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  selectedOptionButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: fontSizes.medium,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionLabel: {
    color: '#007AFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summarySection: {
    margin: spacing.sm,
  },
  summaryCard: {
    backgroundColor: '#e8f5e8',
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  summaryText: {
    fontSize: fontSizes.medium,
    color: '#2d5a2d',
    fontWeight: '500',
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    margin: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  continueButtonText: {
    fontSize: fontSizes.medium,
    color: '#fff',
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
});
