/**
 * Özel hatırlatıcılar için yardımcı fonksiyonlar
 */

/**
 * Tarih formatlarını işler
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  } catch (error) {
    console.error('Tarih formatlama hatası:', error);
    return dateString;
  }
};

/**
 * Saat formatını düzenler (HH:mm)
 */
export const formatTime = (time) => {
  if (!time) return '00:00';
  return time;
};

/**
 * Özel hatırlatıcıları anasayfa formatına çevirir
 */
export const transformCustomRemindersToReminders = (customReminders) => {
  const todayReminders = [];
  const upcomingReminders = [];

  if (!customReminders || !Array.isArray(customReminders)) {
    return { todayReminders: [], upcomingReminders: [] };
  }

  customReminders.forEach(reminder => {
    if (typeof reminder.daysLeft !== 'number') {
      return;
    }

    if (reminder.daysLeft === 0) {
      todayReminders.push({
        id: `custom-${reminder.id}`,
        originalId: reminder.id,
        reminderType: 'custom',
        time: reminder.time,
        title: reminder.title,
        iconConfig: { 
          name: 'notifications', 
          color: '#A29BFE', 
          backgroundColor: 'rgba(162, 155, 254, 0.1)' 
        },
      });
    } else if (reminder.daysLeft > 0) {
      upcomingReminders.push({
        id: `custom-${reminder.id}`,
        originalId: reminder.id,
        reminderType: 'custom',
        time: formatDate(reminder.date),
        title: reminder.title,
        details: `${reminder.daysLeft} gün kaldı`,
        iconConfig: { 
          name: 'notifications', 
          color: '#FD79A8', 
          backgroundColor: 'rgba(253, 121, 168, 0.1)' 
        },
        daysLeft: reminder.daysLeft,
      });
    }
  });

  // Bugünkü hatırlatıcıları zamana göre sırala
  todayReminders.sort((a, b) => a.time.localeCompare(b.time));
  
  // Yaklaşan hatırlatıcıları gün sayısına göre sırala
  upcomingReminders.sort((a, b) => a.daysLeft - b.daysLeft);

  return { todayReminders, upcomingReminders };
};

/**
 * Hatırlatıcı verisini validate eder
 */
export const validateReminder = (reminder) => {
  const errors = {};

  if (!reminder.title || reminder.title.trim().length === 0) {
    errors.title = 'Lütfen hatırlatıcı başlığı girin';
  }

  if (reminder.title && reminder.title.length > 50) {
    errors.title = 'Başlık en fazla 50 karakter olabilir';
  }

  if (!reminder.date) {
    errors.date = 'Lütfen tarih seçin';
  }

  if (!reminder.time) {
    errors.time = 'Lütfen saat seçin';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Tarihin geçerli olup olmadığını kontrol eder
 */
export const isValidFutureDate = (dateString) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    return targetDate >= today;
  } catch (error) {
    return false;
  }
};


