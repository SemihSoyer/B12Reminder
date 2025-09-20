import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CustomHeader from '../../components/common/CustomHeader';
import { fontSizes, spacing } from '../../constants/responsive';
import { FormSteps, BirthdayDataStructure } from '../../types/birthday';
import { BirthdayService } from '../../utils/storage';

// Step Components
import CalendarStep from '../../components/birthday/CalendarStep';
import ReminderDaysStep from '../../components/birthday/ReminderDaysStep';
import NotificationStep from '../../components/birthday/NotificationStep';
import PersonalInfoStep from '../../components/birthday/PersonalInfoStep';
import ReviewStep from '../../components/birthday/ReviewStep';

export default function AddBirthdayScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(FormSteps.CALENDAR);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    birthDate: '',
    photo: null,
    reminderDays: [1, 3, 7],
    customNote: '',
    notificationMessage: '',
    useTemplateMessage: true,
    selectedTemplate: 'template1',
    isActive: true,
    createdAt: '',
    updatedAt: ''
  });
  const [loading, setLoading] = useState(false);

  // Form adımları
  const steps = [
    { key: FormSteps.CALENDAR, title: 'Tarih Seç', icon: '📅' },
    { key: FormSteps.REMINDER_DAYS, title: 'Hatırlatma', icon: '⏰' },
    { key: FormSteps.NOTIFICATION, title: 'Bildirim', icon: '🔔' },
    { key: FormSteps.PERSONAL_INFO, title: 'Kişi Bilgileri', icon: '👤' },
    { key: FormSteps.REVIEW, title: 'Özet', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Form verisi güncelleme
  const updateFormData = (updates) => {
    console.log('Updating form data:', updates);
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log('New form data:', newData);
      return newData;
    });
  };

  // Bir sonraki adıma geç
  const nextStep = () => {
    console.log('NextStep called, current step:', currentStep);
    console.log('Current form data:', formData);
    
    // Adım bazlı validasyon
    if (currentStep === FormSteps.CALENDAR) {
      if (!formData.birthDate) {
        Alert.alert('Uyarı', 'Lütfen doğum tarihi seçin');
        return;
      }
    }
    
    if (currentStep === FormSteps.REMINDER_DAYS) {
      if (!formData.reminderDays || formData.reminderDays.length === 0) {
        Alert.alert('Uyarı', 'Lütfen en az bir hatırlatma günü seçin');
        return;
      }
    }
    
    if (currentStep === FormSteps.PERSONAL_INFO) {
      // İsim kontrolü devre dışı bırakıldı
    }
    
    if (!isLastStep) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStep(steps[nextStepIndex].key);
    }
  };

  // Önceki adıma dön
  const previousStep = () => {
    if (!isFirstStep) {
      const prevStepIndex = currentStepIndex - 1;
      setCurrentStep(steps[prevStepIndex].key);
    }
  };

  // Form gönderimi
  const handleSubmit = async () => {
    console.log('Submitting form data:', formData);
    setLoading(true);
    
    // Form validasyonu
    if (!formData.birthDate) {
      Alert.alert('Hata', 'Doğum tarihi seçilmelidir');
      setLoading(false);
      return;
    }
    
    // İsim validasyonu devre dışı bırakıldı
    
    try {
      const result = await BirthdayService.addBirthday(formData);
      
      if (result.success) {
        Alert.alert(
          'Başarılı! 🎉',
          'Doğum günü hatırlatıcısı başarıyla eklendi.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Hata', result.error || 'Bir hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Beklenmeyen bir hata oluştu');
      console.error('Error saving birthday:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mevcut adım bileşenini render et
  const renderCurrentStep = () => {
    const commonProps = {
      formData,
      updateFormData,
      onNext: nextStep
    };

    switch (currentStep) {
      case FormSteps.CALENDAR:
        return <CalendarStep {...commonProps} />;
      case FormSteps.REMINDER_DAYS:
        return <ReminderDaysStep {...commonProps} />;
      case FormSteps.NOTIFICATION:
        return <NotificationStep {...commonProps} />;
      case FormSteps.PERSONAL_INFO:
        return <PersonalInfoStep {...commonProps} />;
      case FormSteps.REVIEW:
        return <ReviewStep {...commonProps} onSubmit={handleSubmit} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <CustomHeader 
        title="Doğum Günü Ekle"
        onBackPress={() => navigation.goBack()}
        backgroundColor="#f8f9fa"
      />
      
      <View style={styles.container}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStepIndex + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStepIndex + 1} / {steps.length} - {steps[currentStepIndex]?.title}
          </Text>
        </View>

        {/* Step Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        {currentStep !== FormSteps.REVIEW && (
          <View style={styles.navigationContainer}>
            {!isFirstStep && (
              <TouchableOpacity 
                style={[styles.navButton, styles.backButton]} 
                onPress={previousStep}
              >
                <Text style={styles.backButtonText}>← Geri</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton, isFirstStep && styles.fullWidth]} 
              onPress={nextStep}
            >
              <Text style={styles.nextButtonText}>
                {isLastStep ? 'Tamamla' : 'Devam Et →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: fontSizes.small,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    marginRight: spacing.sm,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    marginLeft: spacing.sm,
  },
  fullWidth: {
    marginLeft: 0,
  },
  backButtonText: {
    fontSize: fontSizes.medium,
    color: '#666',
    fontWeight: '500',
  },
  nextButtonText: {
    fontSize: fontSizes.medium,
    color: '#fff',
    fontWeight: '600',
  },
});
