import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

// Hızlı saat seçimi presetleri
const TIME_PRESETS = [
  { time: '07:00', label: 'Sabah', icon: 'sunny-outline', gradient: ['#FF9A8B', '#FF6A88'] },
  { time: '12:00', label: 'Öğle', icon: 'partly-sunny-outline', gradient: ['#A8EDEA', '#74B9FF'] },
  { time: '18:00', label: 'Akşam', icon: 'moon-outline', gradient: ['#D63031', '#E84393'] },
  { time: '22:00', label: 'Gece', icon: 'bed-outline', gradient: ['#6C5CE7', '#A29BFE'] },
];

export default function WheelTimePicker({ visible, onClose, onTimeSelect, initialTime = '09:00' }) {
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');

  useEffect(() => {
    if (initialTime && initialTime.includes(':')) {
      const [initialHour, initialMinute] = initialTime.split(':');
      setHour(initialHour);
      setMinute(initialMinute);
    }
  }, [initialTime]);

  const handleSelect = () => {
    onTimeSelect(`${hour}:${minute}`);
    onClose();
  };

  const handlePresetSelect = (presetTime) => {
    const [presetHour, presetMinute] = presetTime.split(':');
    setHour(presetHour);
    setMinute(presetMinute);
  };

  const handleQuickSelect = (presetTime) => {
    onTimeSelect(presetTime);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.modalContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.title}>Saat Seçin</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              {/* Hızlı Seçim Presetleri */}
              <View style={styles.presetsContainer}>
                <Text style={styles.sectionTitle}>Hızlı Seçim</Text>
                <View style={styles.presetGrid}>
                  {TIME_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset.time}
                      style={styles.presetCard}
                      onPress={() => handleQuickSelect(preset.time)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={preset.gradient}
                        style={styles.presetGradient}
                      >
                        <Ionicons name={preset.icon} size={24} color="#FFFFFF" />
                        <Text style={styles.presetTime}>{preset.time}</Text>
                        <Text style={styles.presetLabel}>{preset.label}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Manuel Saat Seçimi */}
              <View style={styles.manualContainer}>
                <Text style={styles.sectionTitle}>Manuel Seçim</Text>
                <View style={styles.timeDisplayContainer}>
                  <Text style={styles.timeDisplay}>{hour}:{minute}</Text>
                </View>
                <View style={styles.pickerRow}>
                  <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Saat</Text>
                    <Picker
                      selectedValue={hour}
                      onValueChange={(itemValue) => setHour(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      {HOURS.map((h) => (
                        <Picker.Item key={h} label={h} value={h} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.pickerSeparator}>
                    <Text style={styles.separator}>:</Text>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Dakika</Text>
                    <Picker
                      selectedValue={minute}
                      onValueChange={(itemValue) => setMinute(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      {MINUTES.map((m) => (
                        <Picker.Item key={m} label={m} value={m} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
                <LinearGradient
                  colors={['#74B9FF', '#0984e3']}
                  style={styles.selectButtonGradient}
                >
                  <Text style={styles.selectButtonText}>Seçimi Onayla</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '75%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading2,
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 40,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  presetsContainer: {
    marginBottom: spacing.lg,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '48%',
    marginBottom: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  presetGradient: {
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  presetTime: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: spacing.xs,
  },
  presetLabel: {
    ...FONT_STYLES.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  manualContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  timeDisplayContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timeDisplay: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    fontSize: 36,
    fontWeight: 'bold',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: spacing.xs,
    overflow: 'hidden',
  },
  pickerLabel: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    textAlign: 'center',
    paddingTop: spacing.sm,
    backgroundColor: '#F8F9FA',
  },
  picker: {
    height: 120,
  },
  pickerItem: {
    ...FONT_STYLES.bodyLarge,
    fontSize: 18,
  },
  pickerSeparator: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  separator: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#74B9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  selectButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  selectButtonText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
