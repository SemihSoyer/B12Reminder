import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { fontSizes, spacing } from '../../constants/responsive';

export default function CalendarStep({ formData, updateFormData, onNext }) {
  const [selectedMonth, setSelectedMonth] = useState(
    formData.birthDate ? parseInt(formData.birthDate.split('-')[1]) : null
  );
  const [selectedDay, setSelectedDay] = useState(
    formData.birthDate ? parseInt(formData.birthDate.split('-')[2]) : null
  );

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Seçilen aya göre gün sayısını hesapla
  const getDaysInMonth = (month) => {
    if (!month) return 31;
    // Şubat için 29 gün (artık yıl kontrolü yapmıyoruz, sadece doğum günü için)
    if (month === 2) return 29;
    // 30 günlü aylar: Nisan, Haziran, Eylül, Kasım
    if ([4, 6, 9, 11].includes(month)) return 30;
    return 31;
  };

  const daysInMonth = selectedMonth ? getDaysInMonth(selectedMonth) : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleMonthSelect = (monthIndex) => {
    const newMonth = monthIndex + 1;
    setSelectedMonth(newMonth);
    
    // Eğer seçilen gün, yeni ayın gün sayısından fazlaysa sıfırla
    if (selectedDay && selectedDay > getDaysInMonth(newMonth)) {
      setSelectedDay(null);
    } else if (selectedDay) {
      // Ay değiştirildi ama gün hala geçerliyse, form data'yı güncelle
      const birthDate = `2000-${newMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
      console.log('CalendarStep - Month changed, updating birthDate:', birthDate);
      updateFormData({ birthDate });
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    
    // Ay ve gün seçilmişse otomatik olarak form data'yı güncelle
    if (selectedMonth && day) {
      const birthDate = `2000-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      console.log('CalendarStep - Auto updating birthDate:', birthDate);
      updateFormData({ birthDate });
    }
  };

  const handleContinue = () => {
    if (selectedMonth && selectedDay) {
      // YYYY-MM-DD formatında tarih oluştur (yıl olarak 2000 kullanıyoruz, sadece ay-gün önemli)
      const birthDate = `2000-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
      console.log('CalendarStep - Setting birthDate:', birthDate);
      console.log('CalendarStep - Current formData:', formData);
      updateFormData({ birthDate });
      onNext();
    }
  };

  const canContinue = selectedMonth && selectedDay;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doğum Tarihi Seçin</Text>
        <Text style={styles.subtitle}>
          Hangi ay ve günde doğum günü kutlanacak?
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ay Seçimi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ay Seçin</Text>
          <View style={styles.monthGrid}>
            {months.map((month, index) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  selectedMonth === index + 1 && styles.selectedMonthButton
                ]}
                onPress={() => handleMonthSelect(index)}
              >
                <Text style={[
                  styles.monthButtonText,
                  selectedMonth === index + 1 && styles.selectedMonthButtonText
                ]}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gün Seçimi */}
        {selectedMonth && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {months[selectedMonth - 1]} ayında hangi gün?
            </Text>
            <View style={styles.dayGrid}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDay === day && styles.selectedDayButton
                  ]}
                  onPress={() => handleDaySelect(day)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    selectedDay === day && styles.selectedDayButtonText
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Seçim Özeti */}
        {canContinue && (
          <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🎂</Text>
              <Text style={styles.summaryText}>
                Doğum günü: {selectedDay} {months[selectedMonth - 1]}
              </Text>
            </View>
          </View>
        )}

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
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: '30%',
    backgroundColor: '#f8f9fa',
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectedMonthButton: {
    backgroundColor: '#007AFF',
  },
  monthButtonText: {
    fontSize: fontSizes.medium,
    color: '#333',
    fontWeight: '500',
  },
  selectedMonthButtonText: {
    color: '#fff',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  selectedDayButton: {
    backgroundColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: fontSizes.small,
    color: '#333',
    fontWeight: '500',
  },
  selectedDayButtonText: {
    color: '#fff',
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
