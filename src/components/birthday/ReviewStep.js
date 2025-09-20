import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { fontSizes, spacing } from '../../constants/responsive';
import { NotificationTemplates } from '../../types/birthday';

export default function ReviewStep({ formData, onSubmit, loading }) {
  const getSelectedTemplate = () => {
    if (!formData.useTemplateMessage || !formData.selectedTemplate) return null;
    return NotificationTemplates.find(t => t.id === formData.selectedTemplate);
  };

  const formatBirthDate = () => {
    if (!formData.birthDate) return '';
    const [year, month, day] = formData.birthDate.split('-');
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
  };

  const formatReminderDays = () => {
    if (!formData.reminderDays || formData.reminderDays.length === 0) return '';
    const days = formData.reminderDays.sort((a, b) => a - b);
    return days.map(day => {
      if (day === 1) return '1 gün önce';
      if (day === 7) return '1 hafta önce';
      if (day === 14) return '2 hafta önce';
      if (day === 30) return '1 ay önce';
      return `${day} gün önce`;
    }).join(', ');
  };

  const selectedTemplate = getSelectedTemplate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Özet ve Onay</Text>
        <Text style={styles.subtitle}>
          Bilgileri kontrol edin ve doğum günü hatırlatıcısını kaydedin.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Kişi Bilgileri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Kişi Bilgileri</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>İsim:</Text>
            <Text style={styles.infoValue}>{formData.name}</Text>
          </View>
          {formData.customNote && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Not:</Text>
              <Text style={styles.infoValue}>"{formData.customNote}"</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fotoğraf:</Text>
            <Text style={styles.infoValue}>
              {formData.photo ? 'Eklendi ✓' : 'Eklenmedi'}
            </Text>
          </View>
        </View>

        {/* Doğum Tarihi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎂 Doğum Tarihi</Text>
          <View style={styles.dateCard}>
            <Text style={styles.dateText}>{formatBirthDate()}</Text>
          </View>
        </View>

        {/* Hatırlatma Ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Hatırlatma Ayarları</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hatırlatma zamanları:</Text>
            <Text style={styles.infoValue}>{formatReminderDays()}</Text>
          </View>
        </View>

        {/* Bildirim Mesajı */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Bildirim Mesajı</Text>
          {formData.useTemplateMessage && selectedTemplate ? (
            <View>
              <Text style={styles.templateName}>
                Şablon: {selectedTemplate.title}
              </Text>
              <View style={styles.messagePreview}>
                <Text style={styles.messageText}>
                  {selectedTemplate.message}
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.templateName}>Özel Mesaj</Text>
              <View style={styles.messagePreview}>
                <Text style={styles.messageText}>
                  {formData.notificationMessage}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Başarı Mesajı */}
        <View style={styles.successSection}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <View style={styles.successContent}>
              <Text style={styles.successTitle}>Hazır!</Text>
              <Text style={styles.successText}>
                {formData.name} için doğum günü hatırlatıcısı oluşturulacak.
              </Text>
            </View>
          </View>
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.saveButtonText}>Kaydediliyor...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>✓ Doğum Günü Hatırlatıcısını Kaydet</Text>
          )}
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSizes.medium,
    color: '#666',
    width: 100,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: fontSizes.medium,
    color: '#333',
    flex: 1,
  },
  dateCard: {
    backgroundColor: '#f0f8ff',
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: {
    fontSize: fontSizes.title,
    color: '#1976d2',
    fontWeight: '600',
  },
  templateName: {
    fontSize: fontSizes.small,
    color: '#666',
    marginBottom: spacing.xs,
  },
  messagePreview: {
    backgroundColor: '#f0f8ff',
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  messageText: {
    fontSize: fontSizes.medium,
    color: '#1976d2',
    lineHeight: 20,
  },
  successSection: {
    margin: spacing.sm,
  },
  successCard: {
    backgroundColor: '#e8f5e8',
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: fontSizes.large,
    color: '#2d5a2d',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  successText: {
    fontSize: fontSizes.medium,
    color: '#2d5a2d',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    margin: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    fontSize: fontSizes.medium,
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
