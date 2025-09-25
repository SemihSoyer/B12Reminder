import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import WheelDatePicker from './WheelDatePicker';

export default function AddBirthdayForm({ 
  visible, 
  onClose, 
  onAdd, 
  selectedDate = null 
}) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateObject, setSelectedDateObject] = useState(null);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  useEffect(() => {
    if (visible) {
        if (selectedDate) {
            const day = selectedDate.getDate();
            const month = selectedDate.getMonth();
            setDate(`${day} ${monthNames[month]}`);
            setSelectedDateObject(selectedDate);
        } else {
            // Modal her açıldığında formu temizle (eğer takvimden gelinmediyse)
            setName('');
            setDate('');
            setNote('');
            setSelectedDateObject(null);
        }
    }
  }, [visible, selectedDate]);

  const calculateDaysLeft = (birthdayDate) => {
    if (!birthdayDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    let thisYearBirthday = new Date(birthdayDate);
    thisYearBirthday.setFullYear(currentYear);
    thisYearBirthday.setHours(0, 0, 0, 0);
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(currentYear + 1);
    }
    const diffTime = thisYearBirthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleAdd = () => {
    if (!name.trim() || !date.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen isim ve tarih alanlarını doldurun.');
      return;
    }
    const newBirthday = {
      name: name.trim(),
      date: date.trim(),
      note: note.trim(),
      daysLeft: calculateDaysLeft(selectedDateObject)
    };
    onAdd(newBirthday);
    onClose(); // Formu kapat
  };

  const handleDatePickerSelect = (dateObject, dateString) => {
    setSelectedDateObject(dateObject);
    setDate(dateString);
    setShowDatePicker(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
              <Text style={styles.headerButtonText}>İptal</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Doğum Günü Ekle</Text>
            <TouchableOpacity style={[styles.headerButton, styles.headerButtonPrimary]} onPress={handleAdd}>
              <Text style={styles.headerButtonPrimaryText}>Kaydet</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputSection}>
              <Text style={styles.label}>İsim</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: Ahmet Yılmaz"
                  placeholderTextColor="#ccc"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Tarih</Text>
              <TouchableOpacity 
                style={styles.inputContainer}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color="#888" style={styles.inputIcon} />
                <Text style={[styles.input, !date && styles.placeholder]}>
                  {date || 'Tarih seçmek için tıklayın'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Özel Not (İsteğe bağlı)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="document-text-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Örn: Hediye almayı unutma!"
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>

            {/* Bilgi Notu */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#FF6A88" />
              <Text style={styles.infoText}>
                Doğum günü hatırlatıcınız otomatik olarak hesaplanacak ve size bildirim gönderilecektir.
              </Text>
            </View>
          </ScrollView>
        </View>

        <WheelDatePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={handleDatePickerSelect}
          initialDay={selectedDateObject?.getDate() ?? new Date().getDate()}
          initialMonth={selectedDateObject?.getMonth() ?? new Date().getMonth()}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f2',
    backgroundColor: '#fff',
  },
  headerButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
  },
  headerButtonText: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
  },
  headerButtonPrimary: {
    backgroundColor: '#FF6A88',
  },
  headerButtonPrimaryText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#fff',
  },
  headerTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
  },
  form: {
    padding: spacing.lg,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  label: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: '#eef0f2',
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...FONT_STYLES.bodyMedium,
    color: '#1a1a1a',
  },
  placeholder: {
    color: '#ccc',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 106, 136, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  infoText: {
    ...FONT_STYLES.body,
    color: '#666',
    marginLeft: spacing.sm,
    flex: 1,
  },
});
