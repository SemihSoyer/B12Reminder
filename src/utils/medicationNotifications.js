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
        // Akıllı limit ile manuel zamanlama yapıyoruz
        const intervalDays = frequency.value || 1;
        for (const time of times) {
          const ids = await scheduleIntervalNotifications(name, dosage, time, intervalDays, medication.id);
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
 * Not: Native repeat desteklemiyor, akıllı limit ile manuel scheduling
 */
async function scheduleIntervalNotifications(name, dosage, time, intervalDays, medicationId) {
  const notificationIds = [];
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  const now = new Date();
  
  // 🔹 AKILLI LİMİT SİSTEMİ
  // Interval değerine göre dinamik bildirim sayısı
  let daysToSchedule;
  if (intervalDays <= 3) {
    daysToSchedule = 30;  // Her 1-3 günde → 30 gün (10-30 bildirim)
  } else if (intervalDays <= 6) {
    daysToSchedule = 21;  // Her 4-6 günde → 21 gün (3-5 bildirim)
  } else {
    daysToSchedule = intervalDays * 2;  // Her 7+ günde → 2 döngü (2-4 bildirim)
  }

  for (let dayOffset = 0; dayOffset < daysToSchedule; dayOffset += intervalDays) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + dayOffset);
    targetDate.setHours(hour, minute, 0, 0);

    if (targetDate > now) {
      const notificationId = await NotificationService.scheduleNotification(
        {
          title: name,
          body: `${dosage} - İlaç alma zamanı`,
          data: { 
            type: 'medication', 
            name, 
            time,
            medicationId: medicationId || `${name}-${time}` // ID tracking için
          },
        },
        targetDate
      );

      if (notificationId) {
        notificationIds.push(notificationId);
      }
    }
  }

  console.log(`📋 ${name} için ${notificationIds.length} bildirim zamanlandı (${daysToSchedule} gün)`);
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

/**
 * Tek bir ilacın bildirimlerini yeniden zamanla
 * @param {Object} medication
 * @returns {Array<string>} yeni notification ID'leri
 */
async function rescheduleSingleMedication(medication) {
  try {
    // Eski bildirimleri iptal et
    if (medication.notificationIds && medication.notificationIds.length > 0) {
      await cancelMedicationNotifications(medication.notificationIds);
    }

    // Yeni bildirimleri oluştur
    const newIds = await scheduleMedicationNotifications(medication);
    
    console.log(`🔄 ${medication.name} için bildirimler yenilendi: ${newIds.length} bildirim`);
    return newIds;
  } catch (error) {
    console.error('❌ Tek ilaç yenileme hatası:', error);
    return [];
  }
}

/**
 * İlaç bildirimlerini kontrol et ve gerekirse yenile
 * Otomatik yenileme sistemi için kullanılır
 * @param {Object} medication
 * @param {Function} updateCallback - Storage'ı güncellemek için callback
 */
export async function refreshIfNeeded(medication, updateCallback) {
  try {
    // Sadece interval tipi için kontrol yap
    if (medication.frequency.type !== 'interval') {
      return;
    }

    // Mevcut zamanlanmış tüm bildirimleri al
    const allScheduled = await NotificationService.getAllScheduledNotifications();
    
    // Bu ilaca ait bildirimleri filtrele
    const medNotifications = allScheduled.filter(n => 
      n.content?.data?.medicationId === medication.id
    );

    // Bildirim sayısını kontrol et
    if (medNotifications.length === 0) {
      console.log('⚠️ Hiç bildirim yok, yeniden oluşturuluyor:', medication.name);
      const newIds = await rescheduleSingleMedication(medication);
      
      // Storage'ı güncelle
      if (updateCallback && newIds.length > 0) {
        medication.notificationIds = newIds;
        await updateCallback(medication);
      }
      return;
    }

    // En yakın bildirimin tarihini bul
    const nextNotificationDate = Math.min(
      ...medNotifications.map(n => {
        const trigger = n.trigger;
        // Date trigger ise direkt kullan
        if (trigger.date) {
          return new Date(trigger.date).getTime();
        }
        // Repeating trigger ise şimdilik çok ileri bir tarih döndür
        return Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 yıl sonra
      })
    );

    const now = Date.now();
    const daysUntilNext = (nextNotificationDate - now) / (1000 * 60 * 60 * 24);

    // 🔹 YENİLEME KURALI
    // Interval değerine göre dinamik eşik
    const intervalDays = medication.frequency.value || 1;
    const refreshThreshold = intervalDays <= 3 ? 7 : intervalDays;

    if (daysUntilNext < refreshThreshold) {
      console.log(`🔄 ${medication.name} bildirimleri yenileniyor (${Math.floor(daysUntilNext)} gün kaldı)`);
      const newIds = await rescheduleSingleMedication(medication);
      
      // Storage'ı güncelle
      if (updateCallback && newIds.length > 0) {
        medication.notificationIds = newIds;
        await updateCallback(medication);
      }
    } else {
      console.log(`✅ ${medication.name} bildirimleri güncel (${Math.floor(daysUntilNext)} gün kaldı)`);
    }
  } catch (error) {
    console.error('❌ Yenileme kontrolü hatası:', error);
  }
}

