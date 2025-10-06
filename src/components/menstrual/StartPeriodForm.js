import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { formatDateForDisplay } from '../../utils/menstrualUtils';
import { showAlert } from '../ui/CustomAlert';
import CustomDatePicker from '../custom/CustomDatePicker';

const { height } = Dimensions.get('window');

export default function StartPeriodForm({ visible, onClose, onSubmit }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateString, setSelectedDateString] = useState('');
  const [periodLength, setPeriodLength] = useState('5');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      const today = new Date();
      setSelectedDate(today);
      setSelectedDateString(formatDateForDisplay(today));
      setPeriodLength('5');
    }
  }, [visible]);

  const handleDateSelect = (dateObject, dateString) => {
    setSelectedDate(dateObject);
    setSelectedDateString(dateString);
  };

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    // Validasyon
    const length = parseInt(periodLength);
    if (isNaN(length) || length < 1 || length > 10) {
      showAlert('Error', 'Please enter a valid number of days between 1 and 10.', 'error');
      return;
    }

    // Gelecek tarih kontrolü
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected > today) {
      showAlert('Error', 'You cannot select a future date.', 'error');
      return;
    }

    // 6 aydan eski tarih kontrolü
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (selected < sixMonthsAgo) {
      showAlert(
        'Warning',
        'You selected a date 6 months ago. Are you sure you want to continue?',
        'warning',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => submitData(length),
          },
        ]
      );
      return;
    }

    submitData(length);
  };

  const submitData = (length) => {
    const dateStr = formatDateString(selectedDate);
    onSubmit(dateStr, length);
    handleClose();
  };

  const handleClose = () => {
    setSelectedDate(new Date());
    setSelectedDateString(formatDateForDisplay(new Date()));
    setPeriodLength('5');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Start Period</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Açıklama */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#00B894" />
                <Text style={styles.infoText}>
                  Select the date of your last period
                </Text>
              </View>

              {/* Tarih Seçimi */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Period Start Date</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#E17055"
                    style={styles.inputIcon}
                  />
                  <Text style={styles.selectButtonText}>
                    {selectedDateString || formatDateForDisplay(selectedDate)}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Regl Süresi */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Period Length (How many days?)</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#E17055"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Eg: 5"
                    placeholderTextColor="#999"
                    value={periodLength}
                    onChangeText={setPeriodLength}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={styles.unitText}>days</Text>
                </View>
                <Text style={styles.helperText}>
                  Average 3-7 days
                </Text>
              </View>

              {/* Hızlı Seçim Butonları */}
              <View style={styles.quickSelectSection}>
                <Text style={styles.quickSelectLabel}>Quick Select</Text>
                <View style={styles.quickSelectButtons}>
                  {['3', '4', '5', '6', '7'].map((days) => (
                    <TouchableOpacity
                      key={days}
                      style={[
                        styles.quickButton,
                        periodLength === days && styles.quickButtonActive,
                      ]}
                      onPress={() => setPeriodLength(days)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickButtonText,
                          periodLength === days && styles.quickButtonTextActive,
                        ]}
                      >
                        {days}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bilgi Notu */}
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                    💡 Tip: If you don't remember your period length exactly, 
                  you can select 5 days as average.
                </Text>
              </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#E17055', '#D63031', '#E84393']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.submitText}>Save and Start</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Date Picker Modal */}
          <CustomDatePicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateSelect={handleDateSelect}
            initialDate={selectedDate}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: height * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
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
  headerTitle: {
    ...FONT_STYLES.heading2,
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    ...FONT_STYLES.bodySmall,
    color: '#00B894',
    flex: 1,
  },
  inputSection: {
    marginTop: spacing.lg,
  },
  label: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  selectButtonText: {
    flex: 1,
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
    marginLeft: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
    paddingVertical: spacing.md,
  },
  unitText: {
    ...FONT_STYLES.bodyMedium,
    color: '#999',
  },
  helperText: {
    ...FONT_STYLES.bodySmall,
    color: '#999',
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  quickSelectSection: {
    marginTop: spacing.lg,
  },
  quickSelectLabel: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    marginBottom: spacing.sm,
  },
  quickSelectButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  quickButtonActive: {
    backgroundColor: 'rgba(225, 112, 85, 0.1)',
    borderColor: '#E17055',
  },
  quickButtonText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#666',
  },
  quickButtonTextActive: {
    color: '#E17055',
  },
  noteBox: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  noteText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  submitButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#E17055',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  submitText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
});

