import { NotificationService } from './notificationService';

/**
 * Özel Hatırlatıcı Bildirimleri
 * Tek seferlik bildirim, belirtilen tarih ve saatte
 */

/**
 * Özel hatırlatıcı için bildirim zamanla
 * @param {Object} reminder - { id, title, date, time }
 * @returns {string} notificationId
 */
export async function scheduleCustomReminderNotification(reminder) {
  try {
    const { title, date, time } = reminder;

    // Tarih ve saatten Date objesi oluştur
    const targetDate = NotificationService.createDateFromDateTime(date, time);

    const now = new Date();
    if (targetDate <= now) {
      console.warn('Geçmiş tarih için bildirim zamanlanamaz:', targetDate);
      return null;
    }

    const notificationId = await NotificationService.scheduleNotification(
      {
        title: '⏰ Hatırlatma',
        body: title,
        data: { type: 'custom_reminder', reminderId: reminder.id },
      },
      targetDate
    );

    if (notificationId) {
      console.log('✅ Özel hatırlatıcı bildirimi zamanlandı:', title, 'Tarih:', targetDate);
    }

    return notificationId;
  } catch (error) {
    console.error('❌ Özel hatırlatıcı bildirimi zamanlama hatası:', error);
    return null;
  }
}

/**
 * Özel hatırlatıcı bildirimini iptal et
 * @param {string} notificationId
 */
export async function cancelCustomReminderNotification(notificationId) {
  if (!notificationId) {
    return;
  }

  try {
    await NotificationService.cancelNotification(notificationId);
    console.log('✅ Özel hatırlatıcı bildirimi iptal edildi');
  } catch (error) {
    console.error('❌ Özel hatırlatıcı bildirimi iptal hatası:', error);
  }
}

/**
 * Tüm özel hatırlatıcı bildirimlerini yeniden planla
 * @param {Array<Object>} reminders
 */
export async function rescheduleCustomReminderNotifications(reminders) {
  const allNotificationIds = [];

  try {
    for (const reminder of reminders) {
      // Mevcut bildirimi iptal et
      if (reminder.notificationId) {
        await cancelCustomReminderNotification(reminder.notificationId);
      }

      // Yeni bildirim zamanla
      const notificationId = await scheduleCustomReminderNotification(reminder);
      if (notificationId) {
        allNotificationIds.push(notificationId);
      }
    }

    console.log(`✅ ${reminders.length} özel hatırlatıcı için bildirimler yeniden planlandı`);
    return allNotificationIds;
  } catch (error) {
    console.error('❌ Özel hatırlatıcı bildirimleri yeniden planlama hatası:', error);
    return allNotificationIds;
  }
}

