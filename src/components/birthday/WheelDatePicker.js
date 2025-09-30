import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

const { height } = Dimensions.get('window');

export default function WheelDatePicker({ 
  visible, 
  onClose, 
  onDateSelect,
  initialDay = 1,
  initialMonth = 0 
}) {
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  // Türkçe ay isimleri
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Seçili aya göre günleri oluştur
  const getDaysInMonth = (month) => {
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(selectedMonth);

  // Ayları oluştur
  const months = monthNames.map((name, index) => ({
    label: name,
    value: index
  }));

  // Ay değiştiğinde günü kontrol et ve gerekirse düzelt
  useEffect(() => {
    const maxDaysInMonth = getDaysInMonth(selectedMonth).length;
    if (selectedDay > maxDaysInMonth) {
      setSelectedDay(maxDaysInMonth);
    }
  }, [selectedMonth]);

  const handleConfirm = () => {
    const dateString = `${selectedDay} ${monthNames[selectedMonth]}`;
    const dateObject = new Date(new Date().getFullYear(), selectedMonth, selectedDay);
    
    onDateSelect(dateObject, dateString);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.modalContainer}
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>İptal</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Doğum Tarihi Seç</Text>
          
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmText}>Tamam</Text>
          </TouchableOpacity>
        </View>

        {/* Date Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>
            {selectedDay} {monthNames[selectedMonth]}
          </Text>
        </View>

        {/* Picker Container */}
        <View style={styles.pickerContainer}>
          <View style={styles.pickersRow}>
            {/* Day Picker */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Gün</Text>
              <View style={styles.pickerBorder}>
                <Picker
                  selectedValue={selectedDay}
                  onValueChange={(itemValue) => setSelectedDay(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {days.map(day => (
                    <Picker.Item 
                      key={day} 
                      label={day.toString()} 
                      value={day}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Month Picker */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Ay</Text>
              <View style={styles.pickerBorder}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {months.map(month => (
                    <Picker.Item 
                      key={month.value} 
                      label={month.label} 
                      value={month.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Doğum yılı otomatik olarak her yıl güncellenir
          </Text>
        </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : spacing.md,
    maxHeight: height * 0.7, // Picker'lar için biraz daha yüksek
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  cancelButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  cancelText: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
  },
  title: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
  },
  confirmButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  confirmText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FF6A88',
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: 'rgba(255, 106, 136, 0.1)',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
  },
  previewText: {
    ...FONT_STYLES.heading2,
    color: '#FF6A88',
  },
  pickerContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 200,
  },
  pickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: Platform.OS === 'ios' ? 200 : 150,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  pickerLabel: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  pickerBorder: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 150, // iOS için daha yüksek
    width: '100%',
  },
  pickerItem: {
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
    fontSize: 18,
    height: Platform.OS === 'ios' ? 200 : 150,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  infoText: {
    ...FONT_STYLES.bodySmall,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
