import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { fontSizes, spacing } from '../../constants/responsive';

export default function PersonalInfoStep({ formData, updateFormData, onNext }) {
  const [name, setName] = useState(formData.name || '');
  const [customNote, setCustomNote] = useState(formData.customNote || '');

  const handlePhotoSelect = () => {
    Alert.alert(
      'Fotoğraf Seç',
      'Fotoğraf seçme özelliği yakında eklenecek',
      [{ text: 'Tamam' }]
    );
  };

  const handleContinue = () => {
    const trimmedName = name.trim();
    const finalName = trimmedName || 'İsimsiz'; // Boşsa varsayılan isim
    const updates = { 
      name: finalName,
      customNote: customNote.trim()
    };
    console.log('PersonalInfoStep - Setting data:', updates);
    console.log('PersonalInfoStep - Final name:', finalName);
    console.log('PersonalInfoStep - Current formData:', formData);
    updateFormData(updates);
    onNext();
  };

  const canContinue = true; // İsim kontrolü devre dışı

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kişi Bilgileri</Text>
        <Text style={styles.subtitle}>
          Bu doğum günü kimin için? Bilgilerini ekleyin.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* İsim Soyisim */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İsim Soyisim *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Örn: Ahmet Yılmaz"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          <Text style={styles.characterCount}>
            {name.length}/50
          </Text>
          {/* İsim validasyonu devre dışı */}
        </View>

        {/* Fotoğraf */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotoğraf (İsteğe bağlı)</Text>
          <TouchableOpacity 
            style={styles.photoButton}
            onPress={handlePhotoSelect}
          >
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoText}>
                {formData.photo ? 'Fotoğrafı Değiştir' : 'Fotoğraf Ekle'}
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>
            Hatırlatıcıda gösterilecek fotoğraf (opsiyonel)
          </Text>
        </View>

        {/* Özel Not */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özel Not (İsteğe bağlı)</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            placeholder="Örn: Hediye almayı unutma, çikolata seviyor..."
            value={customNote}
            onChangeText={setCustomNote}
            multiline
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {customNote.length}/200
          </Text>
          <Text style={styles.noteHint}>
            Bu not doğum günü listesinde görünecek
          </Text>
        </View>

        {/* Özet */}
        {canContinue && (
          <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>👤</Text>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryName}>{name}</Text>
                {customNote && (
                  <Text style={styles.summaryNote}>"{customNote}"</Text>
                )}
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={[
            styles.continueButtonText,
            !canContinue && styles.continueButtonTextDisabled
          ]}>
            {'Devam Et →'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: spacing.sm,
    padding: spacing.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontWeight: '500',
    color: '#333',
    marginBottom: spacing.md,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fontSizes.medium,
    color: '#333',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: fontSizes.small,
    color: '#999',
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSizes.small,
    color: '#ff3b30',
    marginTop: spacing.xs,
  },
  photoButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: spacing.xl,
    alignItems: 'center',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  photoText: {
    fontSize: fontSizes.medium,
    color: '#666',
    fontWeight: '500',
  },
  photoHint: {
    fontSize: fontSizes.small,
    color: '#999',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  noteHint: {
    fontSize: fontSizes.small,
    color: '#999',
    marginTop: spacing.xs,
  },
  summarySection: {
    margin: spacing.sm,
  },
  summaryCard: {
    backgroundColor: '#e8f5e8',
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryName: {
    fontSize: fontSizes.medium,
    color: '#2d5a2d',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  summaryNote: {
    fontSize: fontSizes.small,
    color: '#2d5a2d',
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    margin: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  continueButtonText: {
    fontSize: fontSizes.medium,
    color: '#fff',
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
});
