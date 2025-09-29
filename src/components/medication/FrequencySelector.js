import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import WeekDayPicker from './WeekDayPicker';
import MultiSelectCalendar from './MultiSelectCalendar';

const { width } = Dimensions.get('window');

// Modern frequency options
const FREQUENCY_OPTIONS = [
  {
    id: 'daily',
    title: 'Her Gün',
    description: 'Günlük kullanım',
    icon: 'calendar',
    gradient: ['#FF9A8B', '#FF6A88'],
    defaultValue: { type: 'daily', value: 1 }
  },
  {
    id: 'weekly',
    title: 'Haftalık',
    description: 'Belirli günlerde',
    icon: 'calendar-outline',
    gradient: ['#A8EDEA', '#74B9FF'],
    defaultValue: { type: 'weekly', value: [0, 1, 2, 3, 4] } // Hafta içi
  },
  {
    id: 'interval',
    title: 'Aralıklı',
    description: 'Her X günde bir',
    icon: 'repeat',
    gradient: ['#D63031', '#E84393'],
    defaultValue: { type: 'interval', value: 2 }
  },
  {
    id: 'specific',
    title: 'Belirli Tarihler',
    description: 'Özel günlerde',
    icon: 'calendar-check',
    gradient: ['#00B894', '#00CEC9'],
    defaultValue: { type: 'specific_dates', value: [] }
  }
];

export default function FrequencySelector({ visible, onClose, onSelect, currentFrequency }) {
  const [selectedOption, setSelectedOption] = useState('daily');
  const [intervalDays, setIntervalDays] = useState('2');
  const [weeklyDays, setWeeklyDays] = useState([0, 1, 2, 3, 4]); // Varsayılan: Hafta içi
  const [specificDates, setSpecificDates] = useState([]);

  // Akıllı varsayılan değerleri yükle
  useEffect(() => {
    if (visible && currentFrequency) {
      const { type, value } = currentFrequency;
      
      if (type === 'daily') {
        setSelectedOption('daily');
      } else if (type === 'interval') {
        setSelectedOption('interval');
        setIntervalDays(String(value || 2));
      } else if (type === 'weekly') {
        setSelectedOption('weekly');
        setWeeklyDays(Array.isArray(value) ? value : [0, 1, 2, 3, 4]);
      } else if (type === 'specific_dates') {
        setSelectedOption('specific');
        setSpecificDates(Array.isArray(value) ? value : []);
      }
    } else if (visible) {
      // Yeni ekleme - akıllı varsayılanlar
      setSelectedOption('daily');
      setIntervalDays('2');
      setWeeklyDays([0, 1, 2, 3, 4]); // Hafta içi
      setSpecificDates([]);
    }
  }, [visible, currentFrequency]);

  // Modern handleSave with validation
  const handleSave = () => {
    let selection;
    
    switch (selectedOption) {
      case 'daily':
        selection = { type: 'daily', value: 1 };
        break;
        
      case 'interval':
        const interval = parseInt(intervalDays, 10);
        if (isNaN(interval) || interval < 1) {
          alert('Lütfen geçerli bir gün sayısı girin');
          return;
        }
        selection = { type: 'interval', value: interval };
        break;
        
      case 'weekly':
        if (weeklyDays.length === 0) {
          alert('Lütfen en az bir gün seçin');
          return;
        }
        selection = { type: 'weekly', value: weeklyDays.sort((a,b) => a - b) };
        break;
        
      case 'specific':
        if (specificDates.length === 0) {
          alert('Lütfen en az bir tarih seçin');
          return;
        }
        selection = { 
          type: 'specific_dates', 
          value: specificDates.sort((a,b) => new Date(a) - new Date(b))
        };
        break;
        
      default:
        selection = { type: 'daily', value: 1 };
    }
    
    onSelect(selection);
    onClose();
  };

  // Quick select handler
  const handleQuickSelect = (optionId) => {
    const option = FREQUENCY_OPTIONS.find(opt => opt.id === optionId);
    if (option) {
      setSelectedOption(optionId);
      // Hızlı seçim için varsayılan değerlerle kaydet
      if (optionId === 'daily' || optionId === 'weekly') {
        onSelect(option.defaultValue);
        onClose();
      }
    }
  };

  const handleDayPress = (dayIndex) => {
    setWeeklyDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  // Modern FrequencyCard component
  const FrequencyCard = ({ option, isSelected, onPress, onQuickSelect }) => (
    <TouchableOpacity 
      style={[styles.frequencyCard, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isSelected ? option.gradient : ['#F8F9FA', '#F8F9FA']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
            <Ionicons 
              name={option.icon} 
              size={24} 
              color={isSelected ? '#FFFFFF' : option.gradient[1]} 
            />
          </View>
          {(option.id === 'daily' || option.id === 'weekly') && (
            <TouchableOpacity 
              style={styles.quickSelectButton}
              onPress={() => onQuickSelect(option.id)}
            >
              <Text style={styles.quickSelectText}>Hızlı Seç</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>
          {option.title}
        </Text>
        <Text style={[styles.cardDescription, isSelected && styles.selectedCardDescription]}>
          {option.description}
        </Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

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
              <Text style={styles.title}>Tekrarlama Sıklığı</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView 
              style={styles.contentScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Modern Frequency Cards */}
              <View style={styles.cardsContainer}>
                {FREQUENCY_OPTIONS.map((option) => (
                  <FrequencyCard
                    key={option.id}
                    option={option}
                    isSelected={selectedOption === option.id}
                    onPress={() => setSelectedOption(option.id)}
                    onQuickSelect={handleQuickSelect}
                  />
                ))}
              </View>

              {/* Detail Settings */}
              {selectedOption === 'interval' && (
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>Kaç günde bir?</Text>
                  <View style={styles.intervalContainer}>
                    <Text style={styles.intervalText}>Her</Text>
                    <TextInput
                      style={styles.intervalInput}
                      value={intervalDays}
                      onChangeText={setIntervalDays}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles.intervalText}>günde bir</Text>
                  </View>
                </View>
              )}

              {selectedOption === 'weekly' && (
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>Hangi günler?</Text>
                  <WeekDayPicker selectedDays={weeklyDays} onDayPress={handleDayPress} />
                </View>
              )}

              {selectedOption === 'specific' && (
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>Hangi tarihler?</Text>
                  <MultiSelectCalendar 
                    selectedDates={specificDates}
                    onSelectionChange={setSpecificDates}
                  />
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient
                  colors={['#74B9FF', '#0984e3']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Kaydet</Text>
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
    height: '85%',
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
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  frequencyCard: {
    width: (width - spacing.lg * 3) / 2,
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCard: {
    shadowColor: '#74B9FF',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: spacing.lg,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickSelectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickSelectText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    fontSize: 10,
  },
  cardTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.xs,
  },
  selectedCardTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardDescription: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    lineHeight: 16,
  },
  selectedCardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  detailContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  detailTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  intervalText: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
  },
  intervalInput: {
    ...FONT_STYLES.heading3,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    textAlign: 'center',
    minWidth: 50,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  saveButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#74B9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
