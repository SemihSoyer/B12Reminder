import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

// Components
import EmptyState from '../../components/custom/EmptyState';
import AddCustomReminderButton from '../../components/custom/AddCustomReminderButton';
import AddCustomReminderForm from '../../components/custom/AddCustomReminderForm';
import CustomReminderList from '../../components/custom/CustomReminderList';
import { CustomReminderService, SettingsService } from '../../utils/storage';
import { scheduleCustomReminderNotification, cancelCustomReminderNotification } from '../../utils/customReminderNotifications';
import { showAlert } from '../../components/ui/CustomAlert';

export default function CustomRemindersScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Sayfa her odaklandığında hatırlatıcıları yeniden yükle
  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  const loadReminders = async () => {
    try {
      setLoading(true);
      const storedReminders = await CustomReminderService.getAllReminders();
      
      // Hatırlatıcıları yakınlık sırasına göre sırala (en yakın önce)
      const sortedReminders = storedReminders.sort((a, b) => {
        return a.daysLeft - b.daysLeft;
      });
      
      setReminders(sortedReminders);
      
      // 🧹 OTOMATIK TEMİZLİK: Yetim kalmış bildirimleri temizle
      await cleanupOrphanedNotifications(sortedReminders);
    } catch (error) {
      console.error('Error loading custom reminders:', error);
      showAlert('Error', 'Error loading custom reminders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Yetim kalmış (hatırlatıcısı olmayan) bildirimleri temizle
  const cleanupOrphanedNotifications = async (currentReminders) => {
    try {
      // Tüm zamanlanmış bildirimleri al
      const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
      
      // Özel hatırlatıcı bildirimlerini filtrele (data.type === 'custom_reminder')
      const customReminderNotifications = allScheduled.filter(
        notif => notif.content?.data?.type === 'custom_reminder'
      );
      
      if (customReminderNotifications.length === 0) {
        return; // Temizlenecek bildirim yok
      }
      
      // Mevcut hatırlatıcıların notification ID'lerini topla
      const validNotificationIds = currentReminders
        .map(r => r.notificationId)
        .filter(id => id); // null/undefined olanları filtrele
      
      // Yetim kalmış bildirimleri bul ve sil
      let cleanedCount = 0;
      for (const notification of customReminderNotifications) {
        const notifId = notification.identifier;
        
        // Bu bildirim hiçbir hatırlatıcıya ait değilse
        if (!validNotificationIds.includes(notifId)) {
          await Notifications.cancelScheduledNotificationAsync(notifId);
          cleanedCount++;
          console.log('🧹 Yetim bildirim silindi:', notifId);
        }
      }
      
      if (cleanedCount > 0) {
        console.log(`✅ ${cleanedCount} yetim bildirim temizlendi`);
      }
    } catch (error) {
      console.error('Bildirim temizleme hatası:', error);
    }
  };

  const handleFormAdd = async (newReminder) => {
    try {
      // Maksimum 10 hatırlatıcı kontrolü
      if (reminders.length >= 10) {
        showAlert('Limit Exceeded', 'You can only add up to 10 custom reminders.', 'warning');
        return;
      }

      // Önce storage'a kaydet
      const savedReminder = await CustomReminderService.addReminder(newReminder);
      
      if (!savedReminder) {
        showAlert('Error', 'Error adding custom reminder.', 'error');
        return;
      }

      // Bildirimi zamanla (arka planda)
      const notificationsEnabled = await SettingsService.getNotificationsEnabled();
      if (notificationsEnabled) {
        // Bildirimi async olarak zamanla, beklemeden devam et
        scheduleCustomReminderNotification(savedReminder)
          .then(async (notificationId) => {
            if (notificationId) {
              console.log('✅ Bildirim zamanlandı:', notificationId);
              
              // Sistemin bildirimi kaydetmesi için kısa bir bekleme
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // DEBUG: Tüm zamanlanmış bildirimleri listele
              const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
              console.log('📋 Toplam zamanlanmış bildirim sayısı:', allScheduled.length);
              
              if (allScheduled.length > 0) {
                console.log('🔍 TÜM ZAMANLANMIŞ BİLDİRİMLER:');
                allScheduled.forEach((notif, index) => {
                  console.log(`   [${index + 1}] ID: ${notif.identifier}`);
                  console.log(`       Trigger Type: ${notif.trigger?.type || 'unknown'}`);
                  if (notif.trigger) {
                    console.log(`       Trigger Value: ${JSON.stringify(notif.trigger.value)}`);
                    if (notif.trigger.type === 'date') {
                      try {
                        const triggerDate = new Date(notif.trigger.value);
                        console.log(`       Trigger: ${triggerDate.toLocaleString('tr-TR')}`);
                        const now = new Date();
                        const diffSeconds = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);
                        console.log(`       Kalan: ${Math.floor(diffSeconds / 3600)}s ${Math.floor((diffSeconds % 3600) / 60)}d`);
                      } catch (e) {
                        console.log(`       Date parse error: ${e.message}`);
                      }
                    }
                  }
                });
              } else {
                console.warn('⚠️ NO SCHEDULED NOTIFICATION!');
                console.warn('   This means the notification was triggered and deleted immediately.');
              }
              
              // Bu bildirimi bul
              const thisNotification = allScheduled.find(n => n.identifier === notificationId);
              if (thisNotification) {
                console.log('✅ This notification is listed!');
              } else {
                console.error('❌ This notification is not listed!');
                console.error('   ID:', notificationId);
              }
            }
          })
          .catch(error => {
            console.error('Notification scheduling error:', error);
          });
      }
      
      // State'i hemen güncelle
      setReminders(prevReminders => {
        const updatedReminders = [...prevReminders, savedReminder];
        return updatedReminders.sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0));
      });
      
      // Başarı mesajını göster
      setTimeout(() => {
        showAlert(
          'Başarılı!',
          `"${newReminder.title}" custom reminder added.`,
          'success'
        );
      }, 300);
      
    } catch (error) {
      console.error('Error adding custom reminder:', error);
      if (error.message === 'You can only add up to 10 custom reminders.') {
        showAlert('Limit Exceeded', error.message, 'warning');
      } else {
        showAlert('Error', 'Error adding custom reminder.', 'error');
      }
    }
  };

  const handleDelete = async (reminder) => {
    try {
      // Bildirimi iptal et
      if (reminder.notificationId) {
        await cancelCustomReminderNotification(reminder.notificationId);
      }
      
      const success = await CustomReminderService.deleteReminder(reminder.id);
      
      if (success) {
        // State'den kaldır
        setReminders(prevReminders => 
          prevReminders.filter(item => item.id !== reminder.id)
        );
        
        // Başarı mesajını kısa bir gecikme ile göster
        setTimeout(() => {
          showAlert(
            'Silindi!',
            `"${reminder.title}" custom reminder deleted.`,
            'success'
          );
        }, 200);
      } else {
        showAlert('Error', 'Error deleting custom reminder.', 'error');
      }
    } catch (error) {
      console.error('Error deleting custom reminder:', error);
      showAlert('Error', 'Error deleting custom reminder.', 'error');
    }
  };

  const hasReminders = reminders && reminders.length > 0;
  const isAtLimit = reminders.length >= 10;

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
              <Text style={styles.title}>Custom Reminders</Text>
              <View style={styles.headerSpacer} />
            </View>
            {hasReminders && (
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  {reminders.length}/10 Custom Reminder
                </Text>
              </View>
            )}
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="bulb" size={24} color="#6C5CE7" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>For Everything You Want</Text>
                <Text style={styles.infoSubtitle}>
                  Create custom reminders to avoid missing important tasks!
                </Text>
              </View>
            </View>

            {/* Reminder List */}
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>
                {hasReminders ? 'My Reminders' : 'No Custom Reminders Yet'}
              </Text>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : hasReminders ? (
                <CustomReminderList 
                  reminders={reminders} 
                  onDelete={handleDelete}
                />
              ) : (
                <EmptyState />
              )}
            </View>

            {/* Limit Warning */}
            {isAtLimit && (
              <View style={styles.warningCard}>
                <Ionicons name="warning" size={20} color="#E17055" />
                <Text style={styles.warningText}>
                  You have reached the maximum number of custom reminders. Please delete one before adding a new one.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Add Button */}
          <View style={styles.buttonSection}>
            <AddCustomReminderButton 
              onPress={() => setShowAddForm(true)}
              disabled={isAtLimit}
            />
            {isAtLimit && (
              <Text style={styles.limitText}>Maximum 10 custom reminder limit</Text>
            )}
          </View>
        </SafeAreaView>

        {/* Add Custom Reminder Form Modal */}
        <AddCustomReminderForm
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
  counterContainer: {
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  counterText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(162, 155, 254, 0.1)',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(108, 92, 231, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  infoSubtitle: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    lineHeight: 18,
  },
  listSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    marginBottom: spacing.md,
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 112, 85, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  warningText: {
    ...FONT_STYLES.bodySmall,
    color: '#E17055',
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  buttonSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: 'transparent',
  },
  limitText: {
    ...FONT_STYLES.bodySmall,
    color: '#999',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
