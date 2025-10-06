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

// Hızlı seçim önerileri
const QUICK_PRESETS = [
  { value: 1, label: 'Her Gün', icon: 'calendar', gradient: ['#FF9A8B', '#FF6A88'] },
  { value: 2, label: '2 Günde', icon: 'refresh', gradient: ['#A8EDEA', '#74B9FF'] },
  { value: 3, label: '3 Günde', icon: 'repeat', gradient: ['#FFD89B', '#19547B'] },
  { value: 7, label: 'Haftalık', icon: 'calendar-outline', gradient: ['#00B894', '#00CEC9'] },
];

export default function WheelNumberPicker({
  visible,
  onClose,
  onSelect,
  initialValue = 2,
  minValue = 1,
  maxValue = 60,
  title = "Select Interval",
  label = "Days"
}) {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const handleSelect = () => {
    onSelect(selectedValue);
    onClose();
  };

  const handleQuickSelect = (value) => {
    onSelect(value);
    onClose();
  };

  const numbers = Array.from({ length: maxValue - minValue + 1 }, (_, i) => i + minValue);

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
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
              <Text style={styles.title}>{title}</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              {/* Hızlı Seçim Kartları */}
              <View style={styles.presetsContainer}>
                <Text style={styles.sectionTitle}>Quick Select</Text>
                <View style={styles.presetGrid}>
                  {QUICK_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset.value}
                      style={styles.presetCard}
                      onPress={() => handleQuickSelect(preset.value)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={preset.gradient}
                        style={styles.presetGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name={preset.icon} size={28} color="#FFFFFF" />
                        <Text style={styles.presetValue}>{preset.value}</Text>
                        <Text style={styles.presetLabel}>{preset.label}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Manuel Seçim */}
              <View style={styles.manualContainer}>
                <Text style={styles.sectionTitle}>Manual Select</Text>
                <View style={styles.currentValueDisplay}>
                  <Text style={styles.currentValueText}>
                    Every <Text style={styles.currentValueNumber}>{selectedValue}</Text> days
                  </Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {numbers.map((num) => (
                      <Picker.Item key={num} label={String(num)} value={num} />
                    ))}
                  </Picker>
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
                  <Text style={styles.selectButtonText}>Confirm Selection</Text>
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
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  presetGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
  },
  presetValue: {
    ...FONT_STYLES.heading1,
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  presetLabel: {
    ...FONT_STYLES.bodyMedium,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: spacing.xs,
  },
  manualContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  currentValueDisplay: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currentValueText: {
    ...FONT_STYLES.bodyLarge,
    color: '#666',
  },
  currentValueNumber: {
    ...FONT_STYLES.heading2,
    color: '#0984e3',
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  picker: {
    height: 150,
  },
  pickerItem: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
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
