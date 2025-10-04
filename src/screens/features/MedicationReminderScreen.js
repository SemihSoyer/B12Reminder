import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

// Components
import EmptyState from '../../components/medication/EmptyState';
import AddMedicationButton from '../../components/medication/AddMedicationButton';
import AddMedicationForm from '../../components/medication/AddMedicationForm';
import MedicationList from '../../components/medication/MedicationList';
import { MedicationService, SettingsService } from '../../utils/storage';
import { groupMedicationsForToday, transformMedicationsToReminders } from '../../utils/medicationUtils';
import { scheduleMedicationNotifications, cancelMedicationNotifications } from '../../utils/medicationNotifications';
import UpcomingReminders from '../../components/common/UpcomingReminders';
import { useFocusEffect } from '@react-navigation/native';
import { showAlert } from '../../components/ui/CustomAlert';

export default function MedicationReminderScreen({ navigation }) {
  const [allMedications, setAllMedications] = useState([]);
  const [todayMedications, setTodayMedications] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sayfa her odaklandığında ilaçları yeniden yükle
  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [])
  );

  const loadMedications = async () => {
    try {
      setLoading(true);
      const storedMedications = await MedicationService.getAllMedications();
      setAllMedications(storedMedications);
      const grouped = groupMedicationsForToday(storedMedications);
      setTodayMedications(grouped);
      const { upcomingReminders } = transformMedicationsToReminders(storedMedications);
      setUpcomingReminders(upcomingReminders);
    } catch (error) {
      showAlert('Hata', 'İlaçlar yüklenirken bir sorun oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormAdd = async (newMedication) => {
    try {
      const savedMedication = await MedicationService.addMedication(newMedication);
      if (savedMedication) {
        // Bildirimler etkinse, bildirimleri zamanla
        const notificationsEnabled = await SettingsService.getNotificationsEnabled();
        if (notificationsEnabled) {
          const notificationIds = await scheduleMedicationNotifications(savedMedication);
          
          // Notification ID'lerini medication'a ekle
          if (notificationIds && notificationIds.length > 0) {
            savedMedication.notificationIds = notificationIds;
          }
        }
        
        const updatedMedications = [...allMedications, savedMedication];
        setAllMedications(updatedMedications);
        const grouped = groupMedicationsForToday(updatedMedications);
        setTodayMedications(grouped);
        const { upcomingReminders } = transformMedicationsToReminders(updatedMedications);
        setUpcomingReminders(upcomingReminders);
        
        // Başarı mesajını modal kapandıktan sonra göster
        setTimeout(() => {
          showAlert('Başarılı!', `${savedMedication.name} eklendi.`, 'success');
        }, 300);
      } else {
        showAlert('Hata', 'İlaç eklenirken bir sorun oluştu.', 'error');
      }
    } catch (error) {
      showAlert('Hata', 'İlaç eklenirken bir hata oluştu.', 'error');
    }
  };

  const handleDelete = async (medicationToDelete) => {
    try {
      // Bildirimleri iptal et
      if (medicationToDelete.notificationIds && medicationToDelete.notificationIds.length > 0) {
        await cancelMedicationNotifications(medicationToDelete.notificationIds);
      }
      
      const success = await MedicationService.deleteMedication(medicationToDelete.id);
      if (success) {
        const updatedMedications = allMedications.filter(item => item.id !== medicationToDelete.id);
        setAllMedications(updatedMedications);
        const grouped = groupMedicationsForToday(updatedMedications);
        setTodayMedications(grouped);
        const { upcomingReminders } = transformMedicationsToReminders(updatedMedications);
        setUpcomingReminders(upcomingReminders);
        
        // Başarı mesajını kısa bir gecikme ile göster
        setTimeout(() => {
          showAlert('Silindi!', `${medicationToDelete.name} silindi.`, 'success');
        }, 200);
      } else {
        showAlert('Hata', 'İlaç silinirken bir sorun oluştu.', 'error');
      }
    } catch (error) {
        showAlert('Hata', 'İlaç silinirken bir hata oluştu.', 'error');
    }
  };

  const hasTodayMedications = todayMedications.length > 0;

  return (
    <>
      <LinearGradient
        colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>İlaç Hatırlatıcıları</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Upcoming Reminders */}
          <UpcomingReminders reminders={upcomingReminders} onDelete={(id) => handleDelete({ id })} />

          {/* Content */}
          <View style={[styles.content, styles.scrollContent]}>
            <Text style={styles.sectionTitle}>
              {hasTodayMedications ? 'Bugünkü İlaçların' : 'Bugün Planlanmış İlaç Yok'}
            </Text>
            {loading ? (
              <EmptyState message="İlaçlar yükleniyor..." />
            ) : hasTodayMedications ? (
              <MedicationList
                medications={todayMedications}
                onDelete={handleDelete}
              />
            ) : (
              <EmptyState
                message="Bugün için planlanmış bir hatırlatıcınız bulunmuyor."
                subMessage="Yeni bir ilaç ekleyerek başlayın!"
              />
            )}
          </View>

          {/* Add Button */}
          <View style={styles.buttonSection}>
            <AddMedicationButton onPress={() => setShowAddForm(true)} />
          </View>
        </SafeAreaView>

        {/* Add Medication Form Modal */}
        <AddMedicationForm
          visible={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdd={handleFormAdd}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    marginBottom: spacing.md,
  },
  buttonSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
