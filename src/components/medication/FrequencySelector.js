import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import WeekDayPicker from './WeekDayPicker';
import MultiSelectCalendar from './MultiSelectCalendar';

export default function FrequencySelector({ visible, onClose, onSelect, currentFrequency }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyInterval, setDailyInterval] = useState('1');
  const [weeklyDays, setWeeklyDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [specificDates, setSpecificDates] = useState([]);

  useEffect(() => {
    if (visible) {
      // Modal açıldığında mevcut ayarları yükle
      const { type, value } = currentFrequency;
      if (type === 'daily' || type === 'interval') {
        setActiveTab('daily');
        setDailyInterval(String(value));
      } else if (type === 'weekly') {
        setActiveTab('weekly');
        setWeeklyDays(value);
      } else if (type === 'specific_dates') {
        setActiveTab('specific');
        setSpecificDates(value);
      }
    }
  }, [visible, currentFrequency]);

  const handleSave = () => {
    let selection;
    if (activeTab === 'daily') {
      const interval = parseInt(dailyInterval, 10);
      selection = {
        type: interval === 1 ? 'daily' : 'interval',
        value: interval > 0 ? interval : 1,
      };
    } else if (activeTab === 'weekly') {
      selection = {
        type: 'weekly',
        value: weeklyDays.sort((a,b) => a - b),
      };
    } else { // specific
      selection = {
        type: 'specific_dates',
        value: specificDates.sort((a,b) => new Date(a) - new Date(b)),
      };
    }
    onSelect(selection);
    onClose();
  };

  const handleDayPress = (dayIndex) => {
    setWeeklyDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Tekrarlama Sıklığı</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'daily' && styles.tabActive]}
              onPress={() => setActiveTab('daily')}
            >
              <Text style={[styles.tabText, activeTab === 'daily' && styles.tabTextActive]}>Günlük</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
              onPress={() => setActiveTab('weekly')}
            >
              <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>Haftalık</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'specific' && styles.tabActive]}
              onPress={() => setActiveTab('specific')}
            >
              <Text style={[styles.tabText, activeTab === 'specific' && styles.tabTextActive]}>Belirli Günler</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'daily' && (
            <View style={styles.content}>
              <Text style={styles.label}>Kaç günde bir tekrarlansın?</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.prefix}>Her</Text>
                <TextInput
                  style={styles.input}
                  value={dailyInterval}
                  onChangeText={setDailyInterval}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.suffix}>günde bir</Text>
              </View>
            </View>
          )}

          {activeTab === 'weekly' && (
            <View style={styles.content}>
              <Text style={styles.label}>Hangi günler tekrarlansın?</Text>
              <WeekDayPicker selectedDays={weeklyDays} onDayPress={handleDayPress} />
            </View>
          )}

          {activeTab === 'specific' && (
            <View style={styles.content}>
              <Text style={styles.label}>Hangi tarih(ler)de tekrarlansın?</Text>
              <MultiSelectCalendar 
                selectedDates={specificDates}
                onSelectionChange={setSpecificDates}
              />
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
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
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        ...FONT_STYLES.heading3,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 4,
        marginBottom: spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: 16,
    },
    tabActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        ...FONT_STYLES.body,
        textAlign: 'center',
        color: '#666',
    },
    tabTextActive: {
        ...FONT_STYLES.emphasis,
        color: '#1a1a1a',
    },
    content: {
        marginBottom: spacing.lg,
    },
    label: {
        ...FONT_STYLES.body,
        color: '#666',
        marginBottom: spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
    },
    prefix: { ...FONT_STYLES.body, color: '#666', marginRight: spacing.sm },
    input: {
        ...FONT_STYLES.heading3,
        paddingVertical: spacing.md,
        textAlign: 'center',
        width: 50,
    },
    suffix: { ...FONT_STYLES.body, color: '#666', marginLeft: spacing.sm },
    saveButton: {
        backgroundColor: '#74B9FF',
        padding: spacing.md,
        borderRadius: 25,
        alignItems: 'center',
    },
    saveButtonText: {
        ...FONT_STYLES.button,
        color: '#fff',
    },
});
