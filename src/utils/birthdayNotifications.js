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
    // 1. ADIM: Bildirim göndermeden önce izinleri kontrol et ve iste
    const hasPermission = await NotificationService.requestAndCheckPermissions();
    if (!hasPermission) {
      console.error('❌ No permission. Birthday reminder scheduling cancelled.');
      return [];
    }

    console.log('🎂 BIRTHDAY REMINDERS SCHEDULING...');
    console.log('   Birthday:', birthday);

    const { name, date, notificationDaysBefore = 1 } = birthday;
    
    if (!name || !date) {
      console.error('❌ Name or date missing!');
      return [];
    }

    // Parse date ("15 January" format)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dateParts = date.trim().split(' ');
    if (dateParts.length !== 2) {
      console.error('❌ Invalid date format:', date);
      return [];
    }

    const day = parseInt(dateParts[0]);
    const monthIndex = monthNames.indexOf(dateParts[1]);

    if (monthIndex === -1 || isNaN(day) || day < 1 || day > 31) {
      console.error('❌ Invalid day/month values:', day, dateParts[1]);
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

    console.log('   Birthday date:', birthdayDate.toLocaleString('tr-TR'));

    const minimumFutureTime = new Date(now.getTime() + 10000); // 10 saniye

    // 1. Bildirim: X gün önce, saat 09:00
    if (notificationDaysBefore > 0) {
      const beforeDate = new Date(birthdayDate);
      beforeDate.setDate(beforeDate.getDate() - notificationDaysBefore);
      beforeDate.setHours(9, 0, 0, 0);

      if (beforeDate > minimumFutureTime) {
        console.log(`   📅 ${notificationDaysBefore} days before reminder scheduled:`, beforeDate.toLocaleString('tr-TR'));
        
        const notificationId = await NotificationService.scheduleNotification(
          {
            title: '🎂 Upcoming Birthday',
            body: `${name} için ${notificationDaysBefore} gün kaldı!`,
            data: { type: 'birthday', birthdayId: birthday.id, timing: 'before' },
          },
          beforeDate
        );

        if (notificationId) {
          notificationIds.push(notificationId);
          console.log(`   ✅ ${notificationDaysBefore} days before reminder scheduled`);
        }
      } else {
        console.log(`   ⏭️ ${notificationDaysBefore} days before reminder too close, skipped`);
      }
    }

    // 2. Bildirim: Doğum günü, saat 00:01
    const midnightDate = new Date(birthdayDate);
    midnightDate.setHours(0, 1, 0, 0);

    if (midnightDate > minimumFutureTime) {
      console.log('   🌙 Midnight reminder scheduled:', midnightDate.toLocaleString('tr-TR'));
      
      const notificationId = await NotificationService.scheduleNotification(
        {
          title: '🎉 Birthday!',
          body: `Today is ${name}'s birthday!`,
          data: { type: 'birthday', birthdayId: birthday.id, timing: 'midnight' },
        },
        midnightDate
      );

      if (notificationId) {
        notificationIds.push(notificationId);
        console.log('   ✅ Midnight reminder scheduled');
      }
    } else {
      console.log('   ⏭️ Midnight reminder too close, skipped');
    }

    // 3. Bildirim: Doğum günü, saat 09:00
    const morningDate = new Date(birthdayDate);
    morningDate.setHours(9, 0, 0, 0);

    if (morningDate > minimumFutureTime) {
      console.log('   ☀️ Morning reminder scheduled:', morningDate.toLocaleString('tr-TR'));
      
      const notificationId = await NotificationService.scheduleNotification(
        {
          title: '🎂 Birthday Reminder',
          body: `${name}'s birthday is coming up!`,
          data: { type: 'birthday', birthdayId: birthday.id, timing: 'morning' },
        },
        morningDate
      );

      if (notificationId) {
        notificationIds.push(notificationId);
        console.log('   ✅ Morning reminder scheduled');
      }
    } else {
      console.log('   ⏭️ Morning reminder too close, skipped');
    }

    console.log(`✅ TOTAL ${notificationIds.length} BIRTHDAY REMINDERS SCHEDULED: ${name}`);
    return notificationIds;
  } catch (error) {
    console.error('❌ BIRTHDAY REMINDERS SCHEDULING ERROR!');
    console.error('   Error:', error);
    console.error('   Birthday:', birthday);
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
    console.log(`✅ ${notificationIds.length} birthday reminder cancelled`);
  } catch (error) {
    console.error('❌ Birthday reminder cancellation error:', error);
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

    console.log(`✅ ${birthdays.length} birthday reminders rescheduled`);
    return allNotificationIds;
  } catch (error) {
    console.error('❌ Birthday reminders rescheduling error:', error);
    return allNotificationIds;
  }
}

