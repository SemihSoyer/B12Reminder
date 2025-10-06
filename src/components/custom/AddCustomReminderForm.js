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
import { formatDate, validateReminder } from '../../utils/customReminderUtils';
import { showAlert } from '../ui/CustomAlert';
import CustomDatePicker from './CustomDatePicker';
import WheelTimePicker from '../medication/WheelTimePicker';

const { height } = Dimensions.get('window');

export default function AddCustomReminderForm({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateString, setSelectedDateString] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      // Modal açıldığında varsayılan değerleri ayarla
      const now = new Date();
      setTitle('');
      setNote('');
      setSelectedDate(now);
      setSelectedDateString(formatDateForDisplay(now));
      setSelectedTime('09:00');
    }
  }, [visible]);

  const formatDateForDisplay = (date) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDateSelect = (dateObject, dateString) => {
    setSelectedDate(dateObject);
    setSelectedDateString(dateString);
    
    // Bugün seçildiyse, saati otomatik olarak şu anki saatten 1 saat sonrasına ayarla
    const now = new Date();
    const isToday = dateObject.toDateString() === now.toDateString();
    
    if (isToday) {
      const oneHourLater = new Date(now.getTime() + 3600000); // 1 saat ekle
      const hours = oneHourLater.getHours().toString().padStart(2, '0');
      const minutes = oneHourLater.getMinutes().toString().padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    const reminderData = {
      title: title.trim(),
      note: note.trim(),
      date: formatDateString(selectedDate),
      time: selectedTime,
    };

    const validation = validateReminder(reminderData);

    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors).join('\n');
      showAlert('Hata', errorMessage, 'error');
      return;
    }

    // Geçmiş tarih kontrolü
    const now = new Date();
    const reminderDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    reminderDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // En az 1 dakika sonrasına hatırlatıcı eklenebilir
    const oneMinuteLater = new Date(now.getTime() + 60000); // 1 dakika ekle

    if (reminderDateTime < oneMinuteLater) {
      // Bugün için mi kontrol et
      const isToday = reminderDateTime.toDateString() === now.toDateString();
      
      if (isToday) {
        showAlert(
          'Invalid Time', 
          'You can only add a reminder at least 1 minute after the current time for today.\n\nPlease select a later time.', 
          'warning'
        );
      } else {
        showAlert(
          'Invalid Date', 
          'You selected a past date. Please select a date for today or a future date.', 
          'warning'
        );
      }
      return;
    }

    onAdd(reminderData);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setNote('');
    setSelectedDate(new Date());
    setSelectedDateString(formatDateForDisplay(new Date()));
    setSelectedTime('09:00');
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
              <Text style={styles.headerTitle}>New Custom Reminder</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Title Input */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Custom Reminder Title</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color="#A29BFE"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Eg: Meeting, Appointment, Shopping"
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={50}
                  />
                </View>
                <Text style={styles.charCount}>{title.length}/50</Text>
              </View>

              {/* Date Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#A29BFE"
                    style={styles.inputIcon}
                  />
                  <Text style={styles.selectButtonText}>
                    {selectedDateString || formatDateForDisplay(selectedDate)}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Time Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#A29BFE"
                    style={styles.inputIcon}
                  />
                  <Text style={styles.selectButtonText}>
                    {selectedTime}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Note Input (Optional) */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Note (Optional)</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Add a note for your custom reminder..."
                    placeholderTextColor="#999"
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                  />
                </View>
                <Text style={styles.charCount}>{note.length}/200</Text>
              </View>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#6C5CE7" />
                <Text style={styles.infoText}>
                  You can only add up to 10 custom reminders.
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
                  colors={['#A29BFE', '#6C5CE7', '#A29BFE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.submitText}>Add Custom Reminder</Text>
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

          {/* Time Picker Modal */}
          <WheelTimePicker
            visible={showTimePicker}
            onClose={() => setShowTimePicker(false)}
            onTimeSelect={handleTimeSelect}
            initialTime={selectedTime}
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
    height: height * 0.85,
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
  inputSection: {
    marginTop: spacing.lg,
  },
  label: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
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
  textAreaContainer: {
    paddingVertical: spacing.sm,
    alignItems: 'flex-start',
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    ...FONT_STYLES.bodySmall,
    color: '#999',
    marginTop: spacing.xs,
    textAlign: 'right',
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoText: {
    ...FONT_STYLES.bodySmall,
    color: '#6C5CE7',
    marginLeft: spacing.sm,
    flex: 1,
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
    shadowColor: '#6C5CE7',
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


