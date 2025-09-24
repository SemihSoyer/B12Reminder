import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

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

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Saat Seç</Text>
          <View style={styles.pickerRow}>
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
            <Text style={styles.separator}>:</Text>
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
          <TouchableOpacity onPress={handleSelect}>
            <LinearGradient
              colors={['#A8EDEA', '#74B9FF']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.selectButton}
            >
              <Text style={styles.selectButtonText}>Seç</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  pickerContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading3,
    marginBottom: spacing.lg,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
  },
  pickerItem: {
    ...FONT_STYLES.bodyLarge,
  },
  separator: {
    ...FONT_STYLES.heading2,
    marginHorizontal: spacing.sm,
  },
  selectButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 25,
  },
  selectButtonText: {
    ...FONT_STYLES.button,
    color: '#fff',
  },
});
