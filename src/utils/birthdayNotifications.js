import { NotificationService } from './notificationService';

/**
 * Doğum Günü Bildirimleri
 * 3 bildirim zamanlar:
 * 1. X gün önce, saat 09:00
 * 2. Doğum günü, saat 00:01
 * 3. Doğum günü, saat 09:00
 */

/**
 * Doğum günü için bildirimleri zamanla
 * @param {Object} birthday - { id, name, date, notificationDaysBefore }
 * @returns {Array<string>} notificationIds
 */
export async function scheduleBirthdayNotifications(birthday) {
  const notificationIds = [];

  try {
    const { name, date, notificationDaysBefore = 1 } = birthday;
    
    // Tarih parse et ("15 Ocak" formatında)
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const [dayStr, monthName] = date.split(' ');
    const day = parseInt(dayStr);
    const monthIndex = monthNames.indexOf(monthName);

    if (monthIndex === -1 || isNaN(day)) {
      console.error('Invalid date format:', date);
      return [];
    }

    const now = new Date();
    const currentYear = now.getFullYear();

    // Bu yılki doğum günü tarihini oluştur
    let birthdayDate = new Date(currentYear, monthIndex, day, 0, 0, 0, 0);
    
    // Eğer tarih geçmişse, gelecek yıla ayarla
    if (birthdayDate < now) {
      birthdayDate = new Date(currentYear + 1, monthIndex, day, 0, 0, 0, 0);
    }

    // 1. Bildirim: X gün önce, saat 09:00
    if (notificationDaysBefore > 0) {
      const beforeDate = new Date(birthdayDate);
      beforeDate.setDate(beforeDate.getDate() - notificationDaysBefore);
      beforeDate.setHours(9, 0, 0, 0);

      if (beforeDate > now) {
        const notificationId = await NotificationService.scheduleNotification(
          {
            title: '🎂 Yaklaşan Doğum Günü',
            body: `${name} için ${notificationDaysBefore} gün kaldı!`,
            data: { type: 'birthday', birthdayId: birthday.id, timing: 'before' },
          },
          beforeDate
        );

        if (notificationId) {
          notificationIds.push(notificationId);
          console.log(`✅ Doğum günü ${notificationDaysBefore} gün önce bildirimi zamanlandı:`, name);
        }
      }
    }

    // 2. Bildirim: Doğum günü, saat 00:01
    const midnightDate = new Date(birthdayDate);
    midnightDate.setHours(0, 1, 0, 0);

    if (midnightDate > now) {
      const notificationId = await NotificationService.scheduleNotification(
        {
          title: '🎉 Doğum Günü!',
          body: `Bugün ${name}'in doğum günü!`,
          data: { type: 'birthday', birthdayId: birthday.id, timing: 'midnight' },
        },
        midnightDate
      );

      if (notificationId) {
        notificationIds.push(notificationId);
        console.log('✅ Doğum günü gece yarısı bildirimi zamanlandı:', name);
      }
    }

    // 3. Bildirim: Doğum günü, saat 09:00
    const morningDate = new Date(birthdayDate);
    morningDate.setHours(9, 0, 0, 0);

    if (morningDate > now) {
      const notificationId = await NotificationService.scheduleNotification(
        {
          title: '🎂 Doğum Günü Hatırlatması',
          body: `${name}'i tebrik etmeyi unutma!`,
          data: { type: 'birthday', birthdayId: birthday.id, timing: 'morning' },
        },
        morningDate
      );

      if (notificationId) {
        notificationIds.push(notificationId);
        console.log('✅ Doğum günü sabah bildirimi zamanlandı:', name);
      }
    }

    console.log(`📋 Toplam ${notificationIds.length} doğum günü bildirimi zamanlandı:`, name);
    return notificationIds;
  } catch (error) {
    console.error('❌ Doğum günü bildirimleri zamanlama hatası:', error);
    return notificationIds;
  }
}

/**
 * Doğum günü bildirimlerini iptal et
 * @param {Array<string>} notificationIds
 */
export async function cancelBirthdayNotifications(notificationIds) {
  if (!notificationIds || notificationIds.length === 0) {
    return;
  }

  try {
    await NotificationService.cancelNotifications(notificationIds);
    console.log(`✅ ${notificationIds.length} doğum günü bildirimi iptal edildi`);
  } catch (error) {
    console.error('❌ Doğum günü bildirimleri iptal hatası:', error);
  }
}

/**
 * Tüm doğum günü bildirimlerini yeniden planla
 * (Ayarlar değiştiğinde veya bildirimler aktif edildiğinde kullanılır)
 * @param {Array<Object>} birthdays
 */
export async function rescheduleBirthdayNotifications(birthdays) {
  const allNotificationIds = [];

  try {
    for (const birthday of birthdays) {
      // Mevcut bildirimleri iptal et
      if (birthday.notificationIds && birthday.notificationIds.length > 0) {
        await cancelBirthdayNotifications(birthday.notificationIds);
      }

      // Yeni bildirimleri zamanla
      const notificationIds = await scheduleBirthdayNotifications(birthday);
      allNotificationIds.push(...notificationIds);
    }

    console.log(`✅ ${birthdays.length} doğum günü için bildirimler yeniden planlandı`);
    return allNotificationIds;
  } catch (error) {
    console.error('❌ Doğum günü bildirimleri yeniden planlama hatası:', error);
    return allNotificationIds;
  }
}

