import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import WheelDatePicker from './WheelDatePicker';
import { showAlert } from '../ui/CustomAlert';

export default function AddBirthdayForm({ visible, onClose, onAdd, selectedDate }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const day = selectedDate.getDate();
      const monthIndex = selectedDate.getMonth();
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      setDate(`${day} ${monthNames[monthIndex]}`);
    } else {
      setDate('');
    }
    // Reset other fields when the modal is opened with a new date
    setName('');
    setNote('');
  }, [selectedDate, visible]);

  const handleAdd = () => {
    if (!name.trim() || !date.trim()) {
      showAlert('Hata', 'Lütfen isim ve tarih alanlarını doldurun.', 'warning');
      return;
    }

    const newBirthday = {
      id: Date.now().toString(),
      name: name.trim(),
      date: date.trim(),
      note: note.trim(),
    };

    onAdd(newBirthday);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDate('');
    setNote('');
  };

  const handleDateSelect = (dateObject, dateString) => {
    // WheelDatePicker (dateObject, dateString) döner
    // Uygulama genelinde kullandığımız format: "DD Ay"
    if (typeof dateString === 'string' && dateString.trim().length > 0) {
      setDate(dateString.trim());
    } else if (dateObject instanceof Date && !isNaN(dateObject)) {
      const day = dateObject.getDate();
      const monthIndex = dateObject.getMonth();
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      setDate(`${day} ${monthNames[monthIndex]}`);
    }
    setShowDatePicker(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
           <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
          {/* Header */}
           <LinearGradient
            colors={['#FFFFFF', '#F7F7F7']}
            style={styles.formContainer}
          >
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
               <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
                <Ionicons name="gift-outline" size={20} color="#FF6A88" />
                <Text style={styles.headerTitle}>Doğum Günü Ekle</Text>
            </View>
            <TouchableOpacity style={[styles.headerButton, styles.saveButton]} onPress={handleAdd}>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
            {/* İsim */}
            <View style={styles.inputSection}>
                <Text style={styles.label}>İsim</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={22} color="#8e44ad" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Örn: Ahmet Yılmaz"
                        placeholderTextColor="#b2bec3"
                    />
                </View>
            </View>

            {/* Tarih */}
            <View style={styles.inputSection}>
                <Text style={styles.label}>Doğum Günü Tarihi</Text>
                <TouchableOpacity 
                    style={styles.inputContainer}
                    onPress={() => !selectedDate && setShowDatePicker(true)}
                    activeOpacity={selectedDate ? 1 : 0.7}
                >
                    <Ionicons name="calendar-outline" size={22} color="#27ae60" style={styles.inputIcon} />
                    <Text style={[styles.input, !date && { color: '#b2bec3' }]}>
                        {date || 'Tarih seçin'}
                    </Text>
                     {!selectedDate && <Ionicons name="chevron-forward" size={22} color="#636e72" />}
                </TouchableOpacity>
                 {selectedDate && <Text style={styles.infoText}>Tarih takvimden seçildi.</Text>}
            </View>

            {/* Notlar */}
            <View style={styles.inputSection}>
                <Text style={styles.label}>Notlar (İsteğe bağlı)</Text>
                <View style={[styles.inputContainer, { height: 120 }]}>
                  <Ionicons name="document-text-outline" size={22} color="#f39c12" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { textAlignVertical: 'top', paddingTop: spacing.md }]}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Hediye fikri: Kitap..."
                    placeholderTextColor="#b2bec3"
                    multiline
                  />
                </View>
            </View>
            </View>
          </ScrollView>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>

      <WheelDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
   overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    height: 'auto',
    maxHeight: '80%',
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
  },
   headerButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  saveButton: {
      backgroundColor: '#FF6A88',
      shadowColor: '#FF6A88',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
  },
  headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 106, 136, 0.1)',
  },
  headerTitle: {
    ...FONT_STYLES.heading3,
    color: '#FF6A88',
    marginLeft: spacing.sm,
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  label: {
      ...FONT_STYLES.emphasisMedium,
      color: '#2d3436',
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: '#dfe6e9',
      minHeight: 56,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
  },
  inputIcon: {
      marginRight: spacing.md,
  },
  input: {
      flex: 1,
      ...FONT_STYLES.body,
      color: '#2d3436',
      fontSize: 16,
  },
  infoText: {
    ...FONT_STYLES.body,
    fontSize: 12,
    color: '#636e72',
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  }
});
