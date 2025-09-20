import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { fontSizes, spacing } from '../../constants/responsive';
import { NotificationTemplates } from '../../types/birthday';

export default function NotificationStep({ formData, updateFormData, onNext }) {
  const [customMessage, setCustomMessage] = useState(formData.notificationMessage || '');

  const handleTemplateSelect = (template) => {
    updateFormData({ 
      useTemplateMessage: true,
      selectedTemplate: template.id,
      notificationMessage: template.message
    });
  };

  const handleCustomMessage = () => {
    updateFormData({ 
      useTemplateMessage: false,
      notificationMessage: customMessage
    });
  };

  const handleContinue = () => {
    if (formData.useTemplateMessage || customMessage.trim()) {
      onNext();
    }
  };

  const canContinue = formData.useTemplateMessage || customMessage.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirim Mesajı</Text>
        <Text style={styles.subtitle}>
          Hatırlatıcı bildiriminde nasıl bir mesaj görmek istiyorsunuz?
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Template Seçenekleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hazır Şablonlar</Text>
          
          {NotificationTemplates.map((template) => {
            const isSelected = formData.useTemplateMessage && formData.selectedTemplate === template.id;
            
            return (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateButton,
                  isSelected && styles.selectedTemplateButton
                ]}
                onPress={() => handleTemplateSelect(template)}
              >
                <View style={styles.templateHeader}>
                  <Text style={[
                    styles.templateTitle,
                    isSelected && styles.selectedTemplateTitle
                  ]}>
                    {template.title}
                  </Text>
                  <View style={[
                    styles.radio,
                    isSelected && styles.selectedRadio
                  ]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </View>
                <Text style={[
                  styles.templateMessage,
                  isSelected && styles.selectedTemplateMessage
                ]}>
                  {template.message}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Özel Mesaj */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özel Mesaj</Text>
          
          <TouchableOpacity
            style={[
              styles.customMessageContainer,
              !formData.useTemplateMessage && styles.selectedCustomContainer
            ]}
            onPress={() => updateFormData({ useTemplateMessage: false })}
          >
            <View style={styles.customHeader}>
              <Text style={[
                styles.customTitle,
                !formData.useTemplateMessage && styles.selectedCustomTitle
              ]}>
                Kendi mesajınızı yazın
              </Text>
              <View style={[
                styles.radio,
                !formData.useTemplateMessage && styles.selectedRadio
              ]}>
                {!formData.useTemplateMessage && <View style={styles.radioDot} />}
              </View>
            </View>
            
            <TextInput
              style={[
                styles.textInput,
                !formData.useTemplateMessage && styles.selectedTextInput
              ]}
              placeholder="Örn: Ahmet'in doğum günü yaklaşıyor! 🎂"
              value={customMessage}
              onChangeText={setCustomMessage}
              onFocus={() => updateFormData({ useTemplateMessage: false })}
              multiline
              maxLength={100}
            />
            <Text style={styles.characterCount}>
              {customMessage.length}/100
            </Text>
          </TouchableOpacity>
        </View>

        {/* Önizleme */}
        {canContinue && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Önizleme</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewIcon}>🔔</Text>
              <Text style={styles.previewText}>
                {formData.useTemplateMessage 
                  ? formData.notificationMessage 
                  : customMessage
                }
              </Text>
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
            {canContinue ? 'Devam Et →' : 'Bir seçenek belirleyin'}
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
  templateButton: {
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  selectedTemplateButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  templateTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '500',
    color: '#333',
  },
  selectedTemplateTitle: {
    color: '#007AFF',
  },
  templateMessage: {
    fontSize: fontSizes.small,
    color: '#666',
    lineHeight: 18,
  },
  selectedTemplateMessage: {
    color: '#0056b3',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#007AFF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  customMessageContainer: {
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: 8,
  },
  selectedCustomContainer: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  customTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '500',
    color: '#333',
  },
  selectedCustomTitle: {
    color: '#007AFF',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fontSizes.medium,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectedTextInput: {
    borderColor: '#007AFF',
  },
  characterCount: {
    fontSize: fontSizes.small,
    color: '#999',
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  previewSection: {
    margin: spacing.sm,
  },
  previewTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '500',
    color: '#333',
    marginBottom: spacing.sm,
  },
  previewCard: {
    backgroundColor: '#f0f8ff',
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  previewText: {
    fontSize: fontSizes.medium,
    color: '#1976d2',
    flex: 1,
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
