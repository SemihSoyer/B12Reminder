import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * YENİ VE TEMİZ BİLDİRİM SERVİSİ
 * Expo Notifications dokümantasyonunu takip ederek sıfırdan yazıldı
 */

// Not: Notification handler App.js içinde merkezi olarak ayarlanır

export const NotificationService = {
  /**
   * Push notification izinlerini iste ve kontrol et
   */
  async requestAndCheckPermissions() {
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
        console.log('📱 Bildirim izni isteniyor...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('❌ Kullanıcı bildirim izni vermedi.');
        return false;
      }

      console.log('✅ Bildirim izinleri verildi.');
      return true;
    } else {
      console.warn('⚠️ Bildirimler için fiziksel bir cihaz gereklidir.');
      return false;
    }
  },

  /**
   * Bildirim izin durumunu kontrol et (izin istemeden)
   */
  async checkPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  /**
   * TEK SEFERLİK BİLDİRİM ZAMANLA
   * Expo dokümantasyonunun önerdiği EN BASİT yöntem
   * 
   * @param {Object} notification - { title, body, data }
   * @param {Date} triggerDate - Bildirim zamanı
   * @returns {string} notificationId
   */
  async scheduleNotification(notification, triggerDate) {
    try {
      console.log('\n🔔 ===== BİLDİRİM ZAMANLAMA BAŞLIYOR =====');
      
      // 1. Tarih validasyonu
      if (!triggerDate || !(triggerDate instanceof Date) || isNaN(triggerDate.getTime())) {
        console.error('❌ Geçersiz tarih objesi:', triggerDate);
        return null;
      }

      const now = new Date();
      
      // 2. Gelecek tarih kontrolü (minimum 1 saniye)
      if (triggerDate <= now) {
        console.error('❌ Geçmiş tarih:', triggerDate.toLocaleString('tr-TR'));
        return null;
      }

      // 3. Saniye cinsinden gecikme hesapla
      const delayInSeconds = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);
      
      console.log('📊 BİLDİRİM BİLGİLERİ:');
      console.log('   Başlık:', notification.title);
      console.log('   Şu an:', now.toLocaleString('tr-TR'));
      console.log('   Hedef:', triggerDate.toLocaleString('tr-TR'));
      console.log('   Gecikme:', delayInSeconds, 'saniye');
      console.log('   Gecikme:', Math.floor(delayInSeconds / 3600), 'saat', Math.floor((delayInSeconds % 3600) / 60), 'dakika');

      // 4. BİLDİRİMİ ZAMANLA - TimeInterval Trigger (EN GARANTİLİ YÖNTEM)
      console.log('⏰ scheduleNotificationAsync çağrılıyor...');
      
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          badge: 1,
        },
        trigger: {
          type: 'timeInterval',
          seconds: delayInSeconds,
          repeats: false,
        },
      });

      console.log('✅ Bildirim zamanlandı!');
      console.log('   ID:', identifier);
      console.log('===== BİLDİRİM ZAMANLAMA BİTTİ =====\n');
      
      return identifier;
    } catch (error) {
      console.error('\n❌ ===== BİLDİRİM ZAMANLAMA HATASI =====');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      console.error('Notification:', notification);
      console.error('Trigger Date:', triggerDate);
      console.error('==========================================\n');
      return null;
    }
  },

  /**
   * TEKRARLAYAN BİLDİRİM ZAMANLA (Günlük/Haftalık)
   */
  async scheduleRepeatingNotification(notification, trigger) {
    try {
      console.log('🔁 Tekrarlayan bildirim zamanlanıyor...');
      console.log('   Saat:', `${trigger.hour}:${trigger.minute}`);
      if (trigger.weekday !== undefined) {
        console.log('   Gün:', trigger.weekday);
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          badge: 1,
        },
        trigger: {
          type: 'calendar',
          hour: trigger.hour,
          minute: trigger.minute,
          repeats: true,
          ...(trigger.weekday !== undefined && { weekday: trigger.weekday }),
        },
      });

      console.log('✅ Tekrarlayan bildirim zamanlandı:', identifier);
      return identifier;
    } catch (error) {
      console.error('❌ Tekrarlayan bildirim hatası:', error);
      console.error('   Trigger:', trigger);
      return null;
    }
  },

  /**
   * Belirli bir bildirimi iptal et
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
   */
  async cancelNotifications(notificationIds) {
    if (!notificationIds || notificationIds.length === 0) return;

    try {
      const promises = notificationIds
        .filter(id => id)
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
   * @param {string} dateString - "15 Ocak" veya "2025-10-06" formatında
   * @param {string} timeString - "09:00" formatında
   * @returns {Date|null}
   */
  createDateFromDateTime(dateString, timeString) {
    try {
      if (!dateString || !timeString) {
        console.error('❌ Tarih veya saat bilgisi eksik!');
        return null;
      }

      // Saat parse
      const timeParts = timeString.split(':');
      if (timeParts.length !== 2) {
        console.error('❌ Geçersiz saat formatı:', timeString);
        return null;
      }

      const hour = parseInt(timeParts[0]);
      const minute = parseInt(timeParts[1]);

      if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        console.error('❌ Geçersiz saat değeri:', hour, minute);
        return null;
      }

      let targetDate = null;

      // ISO formatı kontrolü (YYYY-MM-DD)
      if (dateString.includes('-') && dateString.length === 10) {
        const dateParts = dateString.split('-');
        if (dateParts.length !== 3) {
          console.error('❌ Geçersiz ISO tarih formatı:', dateString);
          return null;
        }

        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          console.error('❌ Geçersiz tarih değerleri:', year, month, day);
          return null;
        }

        if (month < 1 || month > 12 || day < 1 || day > 31) {
          console.error('❌ Tarih aralık dışı:', month, day);
          return null;
        }

        // LOKAL ZAMANDA tarih oluştur
        targetDate = new Date(year, month - 1, day, hour, minute, 0, 0);
      } else {
        // Türkçe format (15 Ocak)
        const monthNames = [
          'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];

        const dateParts = dateString.split(' ');
        if (dateParts.length !== 2) {
          console.error('❌ Geçersiz tarih formatı:', dateString);
          return null;
        }

        const day = parseInt(dateParts[0]);
        const monthIndex = monthNames.indexOf(dateParts[1]);

        if (isNaN(day) || monthIndex === -1 || day < 1 || day > 31) {
          console.error('❌ Geçersiz gün/ay değerleri:', day, dateParts[1]);
          return null;
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        
        targetDate = new Date(currentYear, monthIndex, day, hour, minute, 0, 0);
        
        if (targetDate < now) {
          targetDate = new Date(currentYear + 1, monthIndex, day, hour, minute, 0, 0);
        }
      }

      // Son validasyon
      if (!targetDate || isNaN(targetDate.getTime())) {
        console.error('❌ Oluşturulan tarih geçersiz!');
        return null;
      }

      return targetDate;
    } catch (error) {
      console.error('❌ HATA: Tarih oluşturma başarısız!');
      console.error('   Date String:', dateString);
      console.error('   Time String:', timeString);
      console.error('   Error:', error);
      return null;
    }
  },

  /**
   * ISO tarih string'inden Date objesi oluştur
   */
  createDateFromISO(isoDateString) {
    return new Date(isoDateString);
  },
};

export default NotificationService;
