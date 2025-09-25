const DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

// Tarihi "15 Eki 2025" formatına çevirir
const formatSpecificDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('tr-TR', { month: 'short' });
  return `${day} ${month}`;
};

export const getFrequencyText = (frequency) => {
  if (!frequency) return 'Seçilmedi';

  const { type, value } = frequency;

  if (type === 'daily') {
    return 'Her Gün';
  }

  if (type === 'interval') {
    return `Her ${value} günde bir`;
  }

  if (type === 'weekly') {
    if (!value || value.length === 0) return 'Seçilmedi';
    if (value.length === 7) return 'Her Gün';
    
    // Haftanın tüm günleri ve hafta sonu/içi kısayolları
    const weekdays = [0, 1, 2, 3, 4];
    const weekend = [5, 6];
    const isWeekdays = value.length === 5 && weekdays.every(day => value.includes(day));
    const isWeekend = value.length === 2 && weekend.every(day => value.includes(day));

    if (isWeekdays) return 'Hafta İçi Her Gün';
    if (isWeekend) return 'Hafta Sonu';

    return value.map(dayIndex => DAYS_SHORT[dayIndex]).join(', ');
  }

  if (type === 'specific_dates') {
    if (!value || value.length === 0) return 'Seçilmedi';
    if (value.length === 1) return formatSpecificDate(value[0]);
    if (value.length > 2) return `${value.length} gün seçildi`;
    return value.map(formatSpecificDate).join(' & ');
  }

  return 'Seçilmedi';
};

/**
 * Belirli bir ilacın, verilen tarihte aktif olup olmadığını kontrol eder.
 * @param {object} medication - İlaç objesi.
 * @param {Date} date - Kontrol edilecek tarih.
 * @returns {boolean}
 */
const isMedicationForDate = (medication, date) => {
  const { frequency, createdAt } = medication;
  if (!frequency) return false;

  const { type, value } = frequency;

  // Haftanın gününü Pzt=0, Sal=1, ..., Paz=6 yap
  const dayOfWeek = (date.getDay() + 6) % 7;

  switch (type) {
    case 'daily':
      return true;

    case 'interval':
      if (!createdAt) return false; // Başlangıç tarihi olmadan hesaplanamaz
      const startDate = new Date(createdAt);
      startDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      const diffTime = targetDate - startDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays >= 0 && diffDays % value === 0;

    case 'weekly':
      return value.includes(dayOfWeek);

    case 'specific_dates':
      const dateFormatted = date.toISOString().split('T')[0]; // YYYY-MM-DD
      return value.includes(dateFormatted);

    default:
      return false;
  }
};

/**
 * İlaç listesini anasayfa hatırlatıcı formatına çevirir.
 * @param {Array} medications - İlaç objeleri dizisi.
 * @returns {{todayReminders: Array, upcomingReminders: Array}}
 */
export const transformMedicationsToReminders = (medications) => {
  const todayReminders = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!medications || !Array.isArray(medications)) {
    return { todayReminders: [], upcomingReminders: [] };
  }

  // Bugünkü hatırlatıcıları bul
  medications.forEach(med => {
    if (isMedicationForDate(med, today)) {
      med.times.forEach(time => {
        todayReminders.push({
          id: `med-${med.id}-${time}`,
          originalId: med.id,
          reminderType: 'medication',
          time: time,
          title: `${med.name} (${med.dosage})`,
          icon: '💊',
        });
      });
    }
  });

  // Yaklaşan hatırlatıcıları bul (sonraki 30 gün içinde ilk vuku bulma)
  const upcomingRemindersMap = new Map();
  for (let i = 1; i <= 30; i++) {
    const futureDate = new Date();
    futureDate.setHours(0, 0, 0, 0);
    futureDate.setDate(futureDate.getDate() + i);

    medications.forEach(med => {
      // Bu ilaç için zaten bir sonraki hatırlatıcıyı bulduysak, tekrar arama
      if (!upcomingRemindersMap.has(med.id) && isMedicationForDate(med, futureDate)) {
        const daysLeft = i;
        upcomingRemindersMap.set(med.id, {
          id: `med-upcoming-${med.id}`,
          originalId: med.id,
          reminderType: 'medication',
          time: futureDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
          title: `${med.name} (${med.dosage})`,
          details: `${daysLeft} gün kaldı`,
          icon: '💊',
          daysLeft: daysLeft, // Sıralama için
        });
      }
    });
  }

  // Bugünkü hatırlatıcıları zamana göre sırala
  todayReminders.sort((a, b) => a.time.localeCompare(b.time));
  
  // Yaklaşanları gün sayısına göre sırala
  const upcomingReminders = Array.from(upcomingRemindersMap.values());
  upcomingReminders.sort((a, b) => a.daysLeft - b.daysLeft);

  return { todayReminders, upcomingReminders };
};
