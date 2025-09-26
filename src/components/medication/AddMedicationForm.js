import React, { useState } from 'react';
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
import { getFrequencyText } from '../../utils/medicationUtils';

import FrequencySelector from './FrequencySelector';
import WheelTimePicker from './WheelTimePicker';

export default function AddMedicationForm({ visible, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [times, setTimes] = useState(['09:00']);
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState({ type: 'daily', value: 1 });
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTimeIndex, setEditingTimeIndex] = useState(0);

  const handleAdd = () => {
    if (!name.trim() || !dosage.trim() || times.some(t => !t.trim())) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const newMedication = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim(),
      times: times.filter(t => t.trim()),
      note: note.trim(),
      frequency,
    };

    onAdd(newMedication);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDosage('');
    setTimes(['09:00']);
    setNote('');
    setFrequency({ type: 'daily', value: 1 });
  };

  const handleTimeChange = (newTime) => {
    // Aynı saatin zaten var olup olmadığını kontrol et
    if (times.includes(newTime) && times[editingTimeIndex] !== newTime) {
      Alert.alert('Uyarı', 'Bu saat zaten eklenmiş. Lütfen farklı bir saat seçin.');
      return;
    }

    const newTimes = [...times];
    newTimes[editingTimeIndex] = newTime;
    // Saatleri sıralı tutmak için sort yap
    newTimes.sort();
    setTimes(newTimes);
  };

  const addTimeField = () => {
    if (times.length >= 6) {
      Alert.alert('Limit', 'Maksimum 6 saat ekleyebilirsiniz.');
      return;
    }

    // Yeni saat için akıllı varsayılan değer öner
    const getNextSuggestedTime = () => {
      if (times.length === 0) return '09:00';
      
      const sortedTimes = [...times].sort();
      const lastTime = sortedTimes[sortedTimes.length - 1];
      const [hours, minutes] = lastTime.split(':').map(Number);
      
      // Son saate 4 saat ekle (tipik ilaç alım aralığı)
      let nextHour = hours + 4;
      if (nextHour >= 24) nextHour = nextHour - 24;
      
      const suggestedTime = `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Eğer önerilen saat zaten varsa, farklı bir saat öner
      if (times.includes(suggestedTime)) {
        const commonTimes = ['08:00', '12:00', '16:00', '20:00', '09:00', '13:00', '17:00', '21:00'];
        for (const time of commonTimes) {
          if (!times.includes(time)) {
            return time;
          }
        }
        return '10:00'; // Son çare
      }
      
      return suggestedTime;
    };

    const newTime = getNextSuggestedTime();
    if (!times.includes(newTime)) {
      const newTimes = [...times, newTime].sort();
      setTimes(newTimes);
    }
  };

  const removeTimeField = (index) => {
    if (times.length <= 1) {
      Alert.alert('Uyarı', 'En az bir saat olması gerekiyor.');
      return;
    }

    Alert.alert(
      'Saati Sil',
      `${times[index]} saatini silmek istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const newTimes = times.filter((_, i) => i !== index);
            setTimes(newTimes);
          },
        },
      ]
    );
  };

  const openTimePicker = (index) => {
    setEditingTimeIndex(index);
    setShowTimePicker(true);
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F7F7F7']}
            style={styles.gradientContainer}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Ionicons name="medical-outline" size={20} color="#E17055" />
                <Text style={styles.title}>İlaç Ekle</Text>
              </View>
              <TouchableOpacity style={[styles.headerButton, styles.saveButton]} onPress={handleAdd}>
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
              {/* İlaç Adı */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>İlaç Adı</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="medical-outline" size={22} color="#E17055" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Örn: Parol 500mg"
                    placeholderTextColor="#b2bec3"
                  />
                </View>
              </View>

              {/* Dozaj */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Dozaj</Text>
                 <View style={styles.inputContainer}>
                    <Ionicons name="options-outline" size={22} color="#6c5ce7" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={dosage}
                      onChangeText={setDosage}
                      placeholder="Örn: 1 Tablet"
                      placeholderTextColor="#b2bec3"
                    />
                  </View>
              </View>

              {/* Kullanım Saatleri */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Kullanım Saatleri</Text>
                {times.map((time, index) => (
                  <View key={index} style={styles.timeRow}>
                    <TouchableOpacity onPress={() => openTimePicker(index)} style={styles.timeInputContainer}>
                      <Ionicons name="time-outline" size={22} color="#00b894" style={styles.inputIcon} />
                      <Text style={styles.timeText}>{time}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => removeTimeField(index)} 
                      style={[
                        styles.removeButton, 
                        times.length === 1 && styles.disabledButton
                      ]}
                      disabled={times.length === 1}
                    >
                      <Ionicons 
                        name="trash-outline" 
                        size={22} 
                        color={times.length === 1 ? "#b2bec3" : "#d63031"} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity onPress={addTimeField} style={styles.addButton}>
                  <Ionicons name="add-circle-outline" size={24} color="#0984e3" />
                  <Text style={styles.addButtonText}>Başka bir saat ekle</Text>
                </TouchableOpacity>
                
                {times.length >= 6 && (
                  <Text style={styles.limitText}>
                    Maksimum 6 saat ekleyebilirsiniz
                  </Text>
                )}
              </View>

              {/* Tekrarlama Sıklığı */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Tekrarlama Sıklığı</Text>
                <TouchableOpacity onPress={() => setShowFrequencyModal(true)} style={styles.inputContainer}>
                    <Ionicons name="repeat-outline" size={22} color="#fd79a8" style={styles.inputIcon} />
                    <Text style={styles.input}>{getFrequencyText(frequency)}</Text>
                    <Ionicons name="chevron-forward" size={22} color="#636e72" />
                </TouchableOpacity>
              </View>
              
              {/* Notlar */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Notlar (İsteğe bağlı)</Text>
                <View style={[styles.inputContainer, { height: 100 }]}>
                  <Ionicons name="document-text-outline" size={22} color="#fab1a0" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { textAlignVertical: 'top', paddingTop: spacing.md }]}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Yemekten sonra al..."
                    placeholderTextColor="#b2bec3"
                    multiline
                  />
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
      
      <FrequencySelector 
          visible={showFrequencyModal}
          onClose={() => setShowFrequencyModal(false)}
          onSelect={setFrequency}
          currentFrequency={frequency}
      />
      
      <WheelTimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onTimeSelect={handleTimeChange}
        initialTime={times[editingTimeIndex]}
      />
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
    modalContainer: {
        height: '92%',
        backgroundColor: '#F7F7F7',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
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
      backgroundColor: '#fd79a8',
      shadowColor: '#fd79a8',
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
      backgroundColor: 'rgba(225, 112, 85, 0.1)',
    },
    title: {
        ...FONT_STYLES.heading3,
        color: '#E17055',
        marginLeft: spacing.sm,
    },
    form: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 100,
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
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    timeInputContainer: {
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
        flex: 1,
    },
    timeText: {
      flex: 1,
      ...FONT_STYLES.body,
      color: '#2d3436',
      fontSize: 16,
    },
    removeButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(214, 48, 49, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(214, 48, 49, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#d63031',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    disabledButton: {
        backgroundColor: 'rgba(178, 190, 195, 0.05)',
        borderColor: 'rgba(178, 190, 195, 0.1)',
        opacity: 0.5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: 12,
        backgroundColor: 'rgba(9, 132, 227, 0.05)',
        alignSelf: 'flex-start',
    },
    addButtonText: {
        ...FONT_STYLES.emphasis,
        color: '#0984e3',
        marginLeft: spacing.sm,
    },
    limitText: {
        ...FONT_STYLES.bodySmall,
        color: '#636e72',
        textAlign: 'center',
        marginTop: spacing.sm,
        fontStyle: 'italic',
    },
});
