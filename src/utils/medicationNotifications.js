import { NotificationService } from './notificationService';

/**
 * İlaç Bildirimleri
 * Frequency tipine göre farklı zamanlama:
 * - daily: Her gün, belirlenen saatlerde
 * - interval: Her X günde bir, belirlenen saatlerde
 * - weekly: Belirli günlerde, belirlenen saatlerde
 * - specific_dates: Belirli tarihlerde, belirlenen saatlerde
 */

/**
 * İlaç için bildirimleri zamanla
 * @param {Object} medication - { id, name, dosage, times, frequency }
 * @returns {Array<string>} notificationIds
 */
export async function scheduleMedicationNotifications(medication) {
  const notificationIds = [];

  try {
    const { name, dosage, times, frequency } = medication;

    if (!times || times.length === 0) {
      console.warn('İlaç için saat bilgisi yok:', name);
      return [];
    }

    // Frequency tipine göre farklı zamanlama
    switch (frequency.type) {
      case 'daily':
        // Her gün, her saat için
        for (const time of times) {
          const notificationId = await scheduleDailyNotification(name, dosage, time);
          if (notificationId) {
            notificationIds.push(notificationId);
          }
        }
        break;

      case 'interval':
        // Her X günde bir
        // Not: expo-notifications native olarak "her X günde bir" desteklemiyor
        // Bu yüzden 30 gün için manuel zamanlama yapıyoruz
        const intervalDays = frequency.value || 1;
        for (const time of times) {
          const ids = await scheduleIntervalNotifications(name, dosage, time, intervalDays);
          notificationIds.push(...ids);
        }
        break;

      case 'weekly':
        // Belirli günlerde
        const weekdays = frequency.value || []; // [0, 1, 2, 3, 4] gibi
        for (const time of times) {
          for (const weekday of weekdays) {
            const notificationId = await scheduleWeeklyNotification(name, dosage, time, weekday);
            if (notificationId) {
              notificationIds.push(notificationId);
            }
          }
        }
        break;

      case 'specific_dates':
        // Belirli tarihlerde
        const dates = frequency.value || [];
        for (const time of times) {
          for (const date of dates) {
            const notificationId = await scheduleSpecificDateNotification(name, dosage, time, date);
            if (notificationId) {
              notificationIds.push(notificationId);
            }
          }
        }
        break;

      default:
        console.warn('Bilinmeyen frequency tipi:', frequency.type);
    }

    console.log(`📋 Toplam ${notificationIds.length} ilaç bildirimi zamanlandı:`, name);
    return notificationIds;
  } catch (error) {
    console.error('❌ İlaç bildirimleri zamanlama hatası:', error);
    return notificationIds;
  }
}

/**
 * Günlük tekrarlayan bildirim
 */
async function scheduleDailyNotification(name, dosage, time) {
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  return await NotificationService.scheduleRepeatingNotification(
    {
      title: name,
      body: `${dosage} - İlaç alma zamanı`,
      data: { type: 'medication', name, time },
    },
    {
      hour,
      minute,
      repeats: true,
    }
  );
}

/**
 * Haftalık tekrarlayan bildirim
 */
async function scheduleWeeklyNotification(name, dosage, time, weekday) {
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  // weekday: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday (Expo format)
  return await NotificationService.scheduleRepeatingNotification(
    {
      title: name,
      body: `${dosage} - İlaç alma zamanı`,
      data: { type: 'medication', name, time, weekday },
    },
    {
      hour,
      minute,
      weekday: weekday + 1, // Expo: 1 = Sunday, 2 = Monday, ... (adjust if needed)
      repeats: true,
    }
  );
}

/**
 * Interval bildirimleri (Her X günde bir)
 * Not: Native repeat desteklemiyor, 60 gün için manuel scheduling
 */
async function scheduleIntervalNotifications(name, dosage, time, intervalDays) {
  const notificationIds = [];
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  const now = new Date();
  const daysToSchedule = 60; // 60 gün ileriye kadar

  for (let dayOffset = 0; dayOffset < daysToSchedule; dayOffset += intervalDays) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + dayOffset);
    targetDate.setHours(hour, minute, 0, 0);

    if (targetDate > now) {
      const notificationId = await NotificationService.scheduleNotification(
        {
          title: name,
          body: `${dosage} - İlaç alma zamanı`,
          data: { type: 'medication', name, time },
        },
        targetDate
      );

      if (notificationId) {
        notificationIds.push(notificationId);
      }
    }
  }

  return notificationIds;
}

/**
 * Belirli tarih için bildirim
 */
async function scheduleSpecificDateNotification(name, dosage, time, dateString) {
  try {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    const targetDate = new Date(dateString);
    targetDate.setHours(hour, minute, 0, 0);

    const now = new Date();
    if (targetDate <= now) {
      return null; // Geçmiş tarih
    }

    return await NotificationService.scheduleNotification(
      {
        title: name,
        body: `${dosage} - İlaç alma zamanı`,
        data: { type: 'medication', name, time, date: dateString },
      },
      targetDate
    );
  } catch (error) {
    console.error('Specific date notification error:', error);
    return null;
  }
}

/**
 * İlaç bildirimlerini iptal et
 * @param {Array<string>} notificationIds
 */
export async function cancelMedicationNotifications(notificationIds) {
  if (!notificationIds || notificationIds.length === 0) {
    return;
  }

  try {
    await NotificationService.cancelNotifications(notificationIds);
    console.log(`✅ ${notificationIds.length} ilaç bildirimi iptal edildi`);
  } catch (error) {
    console.error('❌ İlaç bildirimleri iptal hatası:', error);
  }
}

/**
 * Tüm ilaç bildirimlerini yeniden planla
 * @param {Array<Object>} medications
 */
export async function rescheduleMedicationNotifications(medications) {
  const allNotificationIds = [];

  try {
    for (const medication of medications) {
      // Mevcut bildirimleri iptal et
      if (medication.notificationIds && medication.notificationIds.length > 0) {
        await cancelMedicationNotifications(medication.notificationIds);
      }

      // Yeni bildirimleri zamanla
      const notificationIds = await scheduleMedicationNotifications(medication);
      allNotificationIds.push(...notificationIds);
    }

    console.log(`✅ ${medications.length} ilaç için bildirimler yeniden planlandı`);
    return allNotificationIds;
  } catch (error) {
    console.error('❌ İlaç bildirimleri yeniden planlama hatası:', error);
    return allNotificationIds;
  }
}

