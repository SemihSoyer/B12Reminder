import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * Temel Notification Servisi
 * Tüm bildirim işlemlerini yönetir
 */

// Notification handler'ı ayarla (uygulama açıkken bildirimlerin nasıl gösterileceği)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  /**
   * Push notification izinlerini kaydet
   * iOS ve Android için gerekli izinleri iste
   */
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Bildirim izni verilmedi!');
        return { success: false, token: null };
      }
      
      return { success: true, token };
    } else {
      console.log('Fiziksel cihaz gerekli!');
      return { success: false, token: null };
    }
  },

  /**
   * Bildirim izin durumunu kontrol et
   */
  async checkPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  /**
   * Tek seferlik bildirim zamanla
   * @param {Object} notification - { title, body, data }
   * @param {Date} triggerDate - Bildirim zamanı
   * @returns {string} notificationId
   */
  async scheduleNotification(notification, triggerDate) {
    try {
      const now = new Date();
      
      // Geçmiş tarih kontrolü
      if (triggerDate <= now) {
        console.warn('Geçmiş tarih için bildirim zamanlanamaz:', triggerDate);
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { date: triggerDate },
      });

      console.log('✅ Bildirim zamanlandı:', notificationId, 'Tarih:', triggerDate);
      return notificationId;
    } catch (error) {
      console.error('❌ Bildirim zamanlama hatası:', error);
      return null;
    }
  },

  /**
   * Tekrarlayan bildirim zamanla (günlük/haftalık)
   * @param {Object} notification - { title, body, data }
   * @param {Object} trigger - { hour, minute, repeats, weekday }
   * @returns {string} notificationId
   */
  async scheduleRepeatingNotification(notification, trigger) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: trigger.hour,
          minute: trigger.minute,
          repeats: true,
          ...(trigger.weekday !== undefined && { weekday: trigger.weekday }),
        },
      });

      console.log('✅ Tekrarlayan bildirim zamanlandı:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Tekrarlayan bildirim hatası:', error);
      return null;
    }
  },

  /**
   * Belirli bir bildirimi iptal et
   * @param {string} notificationId
   */
  async cancelNotification(notificationId) {
    try {
      if (!notificationId) return false;
      
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('✅ Bildirim iptal edildi:', notificationId);
      return true;
    } catch (error) {
      console.error('❌ Bildirim iptal hatası:', error);
      return false;
    }
  },

  /**
   * Birden fazla bildirimi iptal et
   * @param {Array<string>} notificationIds
   */
  async cancelNotifications(notificationIds) {
    if (!notificationIds || notificationIds.length === 0) return;

    try {
      const promises = notificationIds
        .filter(id => id) // null/undefined olanları filtrele
        .map(id => Notifications.cancelScheduledNotificationAsync(id));
      
      await Promise.all(promises);
      console.log('✅ Bildirimler iptal edildi:', notificationIds.length, 'adet');
    } catch (error) {
      console.error('❌ Toplu bildirim iptal hatası:', error);
    }
  },

  /**
   * Tüm zamanlanmış bildirimleri iptal et
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Tüm bildirimler iptal edildi');
      return true;
    } catch (error) {
      console.error('❌ Tüm bildirimleri iptal hatası:', error);
      return false;
    }
  },

  /**
   * Zamanlanmış tüm bildirimleri getir
   */
  async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 Zamanlanmış bildirimler:', notifications.length, 'adet');
      return notifications;
    } catch (error) {
      console.error('❌ Bildirimleri getirme hatası:', error);
      return [];
    }
  },

  /**
   * Tarih ve saat bilgisinden Date objesi oluştur
   * @param {string} dateString - "15 Ocak" formatında
   * @param {string} timeString - "09:00" formatında
   * @returns {Date}
   */
  createDateFromDateTime(dateString, timeString) {
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const [dayStr, monthName] = dateString.split(' ');
    const day = parseInt(dayStr);
    const monthIndex = monthNames.indexOf(monthName);

    const [hourStr, minuteStr] = timeString.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Bu yılki tarihi oluştur
    let targetDate = new Date(currentYear, monthIndex, day, hour, minute, 0, 0);
    
    // Eğer tarih geçmişse, gelecek yıla ayarla
    if (targetDate < now) {
      targetDate = new Date(currentYear + 1, monthIndex, day, hour, minute, 0, 0);
    }

    return targetDate;
  },

  /**
   * ISO tarih string'inden Date objesi oluştur
   * @param {string} isoDateString - "2025-10-04T12:00:00.000Z"
   * @returns {Date}
   */
  createDateFromISO(isoDateString) {
    return new Date(isoDateString);
  },
};

export default NotificationService;

