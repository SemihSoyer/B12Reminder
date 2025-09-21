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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function AddBirthdayForm({ 
  visible, 
  onClose, 
  onAdd, 
  selectedDate = null 
}) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  // Türkçe ay isimleri
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Seçilen tarih varsa otomatik doldur
  useEffect(() => {
    if (selectedDate) {
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth();
      setDate(`${day} ${monthNames[month]}`);
    }
  }, [selectedDate]);

  // Kalan günleri hesapla
  const calculateDaysLeft = (birthdayDate) => {
    try {
      if (!birthdayDate) {
        return 0;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentYear = today.getFullYear();
      
      // Bu yılki doğum günü tarihini oluştur
      let thisYearBirthday = new Date(birthdayDate);
      thisYearBirthday.setFullYear(currentYear);
      thisYearBirthday.setHours(0, 0, 0, 0);
      
      // Eğer bu yılki doğum günü geçmişse, gelecek yılki doğum gününü hesapla
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(currentYear + 1);
      }
      
      // Gün farkını hesapla
      const diffTime = thisYearBirthday - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diffDays);
    } catch (error) {
      console.warn('Error calculating days left in form:', error);
      return 0;
    }
  };

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen isim giriniz.');
      return;
    }
    
    if (!date.trim()) {
      Alert.alert('Hata', 'Lütfen tarih giriniz.');
      return;
    }

    // Yeni doğum günü objesi oluştur
    const newBirthday = {
      name: name.trim(),
      date: date.trim(),
      daysLeft: selectedDate ? calculateDaysLeft(selectedDate) : 0
    };

    // Parent komponente gönder
    onAdd(newBirthday);
    
    // Formu temizle ve kapat
    setName('');
    setDate('');
    onClose();
  };

  const handleCancel = () => {
    setName('');
    setDate('');
    onClose();
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
        <LinearGradient
          colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientContainer}
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
            
            <Text style={styles.title}>Doğum Günü Ekle</Text>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAdd}
              activeOpacity={0.7}
            >
              <Text style={styles.saveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputSection}>
              <Text style={styles.label}>İsim</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: Ahmet Yılmaz"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Tarih</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="Örn: 15 Ocak"
                  placeholderTextColor="#999"
                  editable={!selectedDate} // Takvimden seçilmişse düzenlenemez
                />
              </View>
              {selectedDate && (
                <Text style={styles.dateHint}>Takvimden seçilen tarih</Text>
              )}
            </View>

            {/* Bilgi Notu */}
            <View style={styles.infoContainer}>
              <Ionicons name="information-circle-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Doğum günü hatırlatıcınız otomatik olarak hesaplanacak ve size bildirim gönderilecektir.
              </Text>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
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
  saveButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  saveText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FF6A88',
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  label: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
    paddingVertical: spacing.xs,
  },
  dateHint: {
    ...FONT_STYLES.bodySmall,
    color: '#FF6A88',
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 106, 136, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  infoText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
});
