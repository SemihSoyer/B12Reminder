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
    const newTimes = [...times];
    newTimes[editingTimeIndex] = newTime;
    setTimes(newTimes);
  };

  const addTimeField = () => {
    setTimes([...times, '12:00']); // Yeni saat için varsayılan
  };

  const removeTimeField = (index) => {
    if (times.length > 1) {
      const newTimes = times.filter((_, i) => i !== index);
      setTimes(newTimes);
    }
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
            colors={['#F7F7F7', '#FAFAFA']}
            style={styles.gradientContainer}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <Text style={styles.title}>İlaç Ekle</Text>
              <TouchableOpacity onPress={handleAdd}>
                <Text style={styles.saveText}>Kaydet</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
              <View style={styles.inputSection}>
                <Text style={styles.label}>İlaç Adı</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="medical-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Örn: Parol 500mg"
                  />
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Dozaj</Text>
                 <View style={styles.inputContainer}>
                    <Ionicons name="options-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={dosage}
                      onChangeText={setDosage}
                      placeholder="Örn: 1 Tablet"
                    />
                  </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Kullanım Saatleri</Text>
                {times.map((time, index) => (
                  <View key={index} style={styles.timeRow}>
                    <TouchableOpacity onPress={() => openTimePicker(index)} style={styles.inputContainer_time}>
                      <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
                      <Text style={styles.input}>{time}</Text>
                    </TouchableOpacity>
                    {times.length > 1 && (
                      <TouchableOpacity onPress={() => removeTimeField(index)} style={styles.removeButton}>
                        <Ionicons name="remove-circle" size={24} color="#FF6A88" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity onPress={addTimeField} style={styles.addButton}>
                  <Ionicons name="add-circle-outline" size={22} color="#74B9FF" />
                  <Text style={styles.addButtonText}>Başka bir saat ekle</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Tekrarlama Sıklığı</Text>
                <TouchableOpacity onPress={() => setShowFrequencyModal(true)} style={styles.inputContainer}>
                    <Ionicons name="repeat-outline" size={20} color="#666" style={styles.inputIcon} />
                    <Text style={styles.input}>{getFrequencyText(frequency)}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputSection}>
                <Text style={styles.label}>Notlar (İsteğe bağlı)</Text>
                <View style={[styles.inputContainer, { height: 80 }]}>
                  <Ionicons name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { textAlignVertical: 'top' }]}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Yemekten sonra al..."
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        height: '85%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    cancelText: {
        ...FONT_STYLES.bodyMedium,
        color: '#666',
    },
    title: {
        ...FONT_STYLES.heading3,
        color: '#1a1a1a',
    },
    saveText: {
        ...FONT_STYLES.emphasisMedium,
        color: '#74B9FF',
    },
    form: {
        padding: spacing.lg,
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
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: '#eee',
        minHeight: 50,
    },
    inputContainer_time:{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: '#eee',
      minHeight: 50,
      flex: 1,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...FONT_STYLES.bodyMedium,
        color: '#1a1a1a',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    removeButton: {
        padding: spacing.sm,
        marginLeft: spacing.sm,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        padding: spacing.sm,
    },
    addButtonText: {
        ...FONT_STYLES.body,
        color: '#74B9FF',
        marginLeft: spacing.xs,
    },
});
