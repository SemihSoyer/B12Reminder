import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import { BirthdayService, SettingsService } from '../../utils/storage';
import { scheduleBirthdayNotifications, cancelBirthdayNotifications } from '../../utils/birthdayNotifications';

// Components
import BirthdayList from '../../components/birthday/BirthdayList';
import EmptyState from '../../components/birthday/EmptyState';
import AddBirthdayButton from '../../components/birthday/AddBirthdayButton';
import MonthlyCalendar from '../../components/birthday/MonthlyCalendar';
import AddBirthdayForm from '../../components/birthday/AddBirthdayForm';
import { showAlert } from '../../components/ui/CustomAlert';

export default function BirthdayReminderScreen({ navigation }) {
  // State'ler
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDateForForm, setSelectedDateForForm] = useState(null);

  // Sayfa yüklendiğinde doğum günlerini getir
  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      const storedBirthdays = await BirthdayService.getAllBirthdays();
      
      // Doğum günlerini yakınlık sırasına göre sırala (en yakın önce)
      const sortedBirthdays = storedBirthdays.sort((a, b) => {
        return a.daysLeft - b.daysLeft;
      });
      
      setBirthdays(sortedBirthdays);
    } catch (error) {
      console.error('Error loading birthdays:', error);
      showAlert('Hata', 'Doğum günleri yüklenirken bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBirthday = () => {
    // Butondan ekleme - tarih seçilmemiş
    setSelectedDateForForm(null);
    setShowAddForm(true);
  };

  const handleDateSelect = (date) => {
    // Takvimden ekleme - tarih önceden seçilmiş
    setSelectedDateForForm(date);
    setShowAddForm(true);
  };

  const handleFormAdd = async (newBirthday) => {
    try {
      // AsyncStorage'a kaydet
      const savedBirthday = await BirthdayService.addBirthday(newBirthday);
      
      if (savedBirthday) {
        // Bildirimler etkinse, bildirimleri zamanla
        const notificationsEnabled = await SettingsService.getNotificationsEnabled();
        if (notificationsEnabled) {
          const notificationIds = await scheduleBirthdayNotifications(savedBirthday);
          
          // Notification ID'lerini birthday'e ekle ve güncelle
          if (notificationIds && notificationIds.length > 0) {
            savedBirthday.notificationIds = notificationIds;
            
            // Storage'ı güncelle
            const allBirthdays = await BirthdayService.getAllBirthdays();
            const updatedBirthdays = allBirthdays.map(b => 
              b.id === savedBirthday.id ? savedBirthday : b
            );
            await BirthdayService.getAllBirthdays(); // Cache'i temizle
          }
        }
        
        // State'i güncelle ve sırala
        setBirthdays(prevBirthdays => {
          const updatedBirthdays = [...prevBirthdays, savedBirthday];
          // Yakınlık sırasına göre sırala
          return updatedBirthdays.sort((a, b) => a.daysLeft - b.daysLeft);
        });
        
        // Başarı mesajını modal kapandıktan sonra göster
        setTimeout(() => {
          showAlert(
            'Başarılı!',
            `${newBirthday.name} için doğum günü hatırlatıcısı eklendi.`,
            'success'
          );
        }, 300);
      } else {
        showAlert('Hata', 'Doğum günü eklenirken bir hata oluştu.', 'error');
      }
    } catch (error) {
      console.error('Error adding birthday:', error);
      showAlert('Hata', 'Doğum günü eklenirken bir hata oluştu.', 'error');
    }
  };

  const handleDelete = async (birthday) => {
    try {
      // Bildirimleri iptal et
      if (birthday.notificationIds && birthday.notificationIds.length > 0) {
        await cancelBirthdayNotifications(birthday.notificationIds);
      }
      
      const success = await BirthdayService.deleteBirthday(birthday.id);
      
      if (success) {
        // State'den kaldır
        setBirthdays(prevBirthdays => 
          prevBirthdays.filter(item => item.id !== birthday.id)
        );
        
        // Başarı mesajını kısa bir gecikme ile göster
        setTimeout(() => {
          showAlert(
            'Silindi!',
            `${birthday.name} için doğum günü hatırlatıcısı silindi.`,
            'success'
          );
        }, 200);
      } else {
        showAlert('Hata', 'Doğum günü silinirken bir hata oluştu.', 'error');
      }
    } catch (error) {
      console.error('Error deleting birthday:', error);
      showAlert('Hata', 'Doğum günü silinirken bir hata oluştu.', 'error');
    }
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setSelectedDateForForm(null);
  };

  const hasBirthdays = birthdays && birthdays.length > 0;

  return (
    <>
      <LinearGradient
        colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
              </TouchableOpacity>
                <Text style={styles.title}>Doğum Günü Hatırlatıcıları</Text>
                <View style={styles.headerSpacer} />
              </View>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Takvim */}
            <MonthlyCalendar 
              birthdays={birthdays}
              onDateSelect={handleDateSelect}
            />

            {/* Doğum Günü Listesi */}
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>
                {hasBirthdays ? 'Kayıtlı Doğum Günleri' : 'Doğum Günleri'}
              </Text>
              {hasBirthdays ? (
                <BirthdayList 
                  birthdays={birthdays} 
                  onDelete={handleDelete}
                />
              ) : (
                <EmptyState />
              )}
            </View>
          </ScrollView>

          {/* Add Button */}
          <View style={styles.buttonSection}>
            <AddBirthdayButton onPress={handleAddBirthday} />
          </View>
        </SafeAreaView>

        {/* Add Birthday Form Modal */}
        <AddBirthdayForm
          visible={showAddForm}
          onClose={handleFormClose}
          onAdd={handleFormAdd}
          selectedDate={selectedDateForForm}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
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
  subtitle: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  listSection: {
    marginTop: spacing.md,
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