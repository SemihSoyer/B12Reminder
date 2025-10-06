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
    // 1. ADIM: Bildirim göndermeden önce izinleri kontrol et ve iste
    const hasPermission = await NotificationService.requestAndCheckPermissions();
    if (!hasPermission) {
      console.error('❌ No permission. Scheduling cancelled.');
      return null;
    }

    console.log('🔔 CUSTOM REMINDER REMINDER SCHEDULING...');
    console.log('   Reminder:', reminder);

    if (!reminder || !reminder.title || !reminder.date || !reminder.time) {
      console.error('❌ Invalid reminder data:', reminder);
      return null;
    }

    const { title, date, time } = reminder;

    console.log('   📝 Title:', title);
    console.log('   📅 Date:', date);
    console.log('   ⏰ Time:', time);

    // Tarih ve saatten Date objesi oluştur
    const targetDate = NotificationService.createDateFromDateTime(date, time);

    // NULL kontrolü (artık hata durumunda null döndürülüyor)
    if (!targetDate) {
      console.error('❌ Date not created! Date string and time are invalid.');
      return null;
    }

    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
      console.error('❌ Created date object is invalid:', targetDate);
      return null;
    }

    // Gelecek tarih kontrolü (ekstra güvenlik)
    const now = new Date();
    const minimumFutureTime = new Date(now.getTime() + 10000); // 10 saniye

    if (targetDate <= minimumFutureTime) {
      console.error('❌ Date is past or too close!');
      console.error('   Now:', now.toLocaleString('tr-TR'));
      console.error('   Target:', targetDate.toLocaleString('tr-TR'));
      return null;
    }

    console.log('✅ Date validation successful, notification service called...');

    const notificationId = await NotificationService.scheduleNotification(
      {
        title: '⏰ Reminder',
        body: title,
        data: { type: 'custom_reminder', reminderId: reminder.id },
      },
      targetDate
    );

    if (notificationId) {
      console.log('✅ CUSTOM REMINDER REMINDER SCHEDULED!');
      console.log('   ID:', notificationId);
      console.log('   Title:', title);
      console.log('   Date:', targetDate.toLocaleString('tr-TR'));
    } else {
      console.error('❌ Notification ID not found - Scheduling failed!');
    }

    return notificationId;
  } catch (error) {
    console.error('❌ CUSTOM REMINDER REMINDER ERROR!');
    console.error('   Error:', error);
    console.error('   Reminder:', reminder);
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
    console.log('✅ Custom reminder notification cancelled');
  } catch (error) {
    console.error('❌ Custom reminder notification cancellation error:', error);
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

    console.log(`✅ ${reminders.length} custom reminder reminders rescheduled`);
    return allNotificationIds;
  } catch (error) {
    console.error('❌ Custom reminder reminders rescheduling error:', error);
    return allNotificationIds;
  }
}

