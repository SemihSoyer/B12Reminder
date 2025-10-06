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
      console.error('❌ Bildirim izni yok. Zamanlama iptal edildi.');
      return null;
    }

    console.log('🔔 ÖZEL HATIRLATICI BİLDİRİM ZAMANLANIYOR...');
    console.log('   Reminder:', reminder);

    if (!reminder || !reminder.title || !reminder.date || !reminder.time) {
      console.error('❌ Geçersiz hatırlatıcı verisi:', reminder);
      return null;
    }

    const { title, date, time } = reminder;

    console.log('   📝 Başlık:', title);
    console.log('   📅 Tarih:', date);
    console.log('   ⏰ Saat:', time);

    // Tarih ve saatten Date objesi oluştur
    const targetDate = NotificationService.createDateFromDateTime(date, time);

    // NULL kontrolü (artık hata durumunda null döndürülüyor)
    if (!targetDate) {
      console.error('❌ Tarih oluşturulamadı! Date string ve time geçersiz.');
      return null;
    }

    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
      console.error('❌ Oluşturulan tarih objesi geçersiz:', targetDate);
      return null;
    }

    // Gelecek tarih kontrolü (ekstra güvenlik)
    const now = new Date();
    const minimumFutureTime = new Date(now.getTime() + 10000); // 10 saniye

    if (targetDate <= minimumFutureTime) {
      console.error('❌ Tarih geçmiş veya çok yakın!');
      console.error('   Şu an:', now.toLocaleString('tr-TR'));
      console.error('   Hedef:', targetDate.toLocaleString('tr-TR'));
      return null;
    }

    console.log('✅ Tarih validasyonu başarılı, bildirim servisi çağrılıyor...');

    const notificationId = await NotificationService.scheduleNotification(
      {
        title: '⏰ Hatırlatma',
        body: title,
        data: { type: 'custom_reminder', reminderId: reminder.id },
      },
      targetDate
    );

    if (notificationId) {
      console.log('✅ ÖZ EL HATIRLATICI BİLDİRİMİ ZAMANLANADI!');
      console.log('   ID:', notificationId);
      console.log('   Başlık:', title);
      console.log('   Tarih:', targetDate.toLocaleString('tr-TR'));
    } else {
      console.error('❌ Bildirim ID alınamadı - Zamanlama başarısız!');
    }

    return notificationId;
  } catch (error) {
    console.error('❌ ÖZEL HATIRLATICI BİLDİRİM HATA!');
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

