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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!medications || !Array.isArray(medications)) {
    return { todayReminders: [], upcomingReminders: [] };
  }

  // Bugünkü hatırlatıcıları gruplamak için bir map kullan
  const todayRemindersMap = new Map();

  medications.forEach(med => {
    if (isMedicationForDate(med, today)) {
      // İlaç adı ve dozajına göre bir anahtar oluştur
      const key = `${med.name}|${med.dosage}`;

      if (!todayRemindersMap.has(key)) {
        // Eğer ilaç map'te yoksa, yeni bir girdi oluştur
        todayRemindersMap.set(key, {
          id: `med-${med.id}`,
          originalId: med.id,
          reminderType: 'medication',
          title: `${med.name}`,
          subTitle: med.dosage,
          times: [], // Saatleri bir dizi olarak tut
          icon: 'medkit-outline',
          // Renk veya diğer ikon bilgileri de buraya eklenebilir
        });
      }

      // Mevcut ilacın saatler dizisine yeni saatleri ekle
      const existing = todayRemindersMap.get(key);
      existing.times.push(...med.times);
      existing.times.sort(); // Saatleri küçükten büyüğe sırala
    }
  });

  // Map'i tekrar diziye çevir
  const todayReminders = Array.from(todayRemindersMap.values()).map(rem => ({
    ...rem,
    // Sıralama için ilk saati ana 'time' alanı olarak ekle
    // Bu, doğum günleri gibi tek zamanlı hatırlatıcılarla uyumluluğu sağlar
    time: rem.times[0], 
  }));

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
          iconConfig: { 
            name: 'medkit-outline', 
            color: '#74B9FF', 
            backgroundColor: 'rgba(116, 185, 255, 0.1)' 
          },
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

const dayOfWeekMap = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const isMedicationForToday = (medication, today) => {
  const { frequency } = medication;
  if (!frequency) return false;

  const todayDayOfWeek = dayOfWeekMap[today.getDay()];

  switch (frequency.type) {
    case 'daily':
      // Her X günde bir mantığı için bir başlangıç tarihi gerekir.
      // Şimdilik, basitçe her X günde birin bugün olup olmadığını kontrol edemeyiz
      // Bu nedenle, 'value' 1 ise her gün kabul edelim.
      // Daha gelişmiş bir mantık için ilacın eklenme tarihi saklanmalıdır.
      return frequency.value === 1;
    
    case 'weekly':
      return frequency.value.includes(todayDayOfWeek);

    case 'specific_dates':
      const todayString = today.toISOString().split('T')[0];
      return frequency.value.includes(todayString);
      
    default:
      return false;
  }
};

export const groupMedicationsForToday = (medications) => {
  const today = new Date();
  
  const todayMedications = medications.filter(med => isMedicationForToday(med, today));

  if (todayMedications.length === 0) {
    return [];
  }

  const timeSlots = {
    Sabah: { icon: 'sunny-outline', start: 5, end: 11, data: [] },
    Öğle: { icon: 'partly-sunny-outline', start: 12, end: 16, data: [] },
    Akşam: { icon: 'moon-outline', start: 17, end: 20, data: [] },
    Gece: { icon: 'bed-outline', start: 21, end: 4, data: [] },
  };

  todayMedications.forEach(med => {
    med.times.forEach(time => {
      const [hour] = time.split(':').map(Number);
      
      if (hour >= timeSlots.Sabah.start && hour <= timeSlots.Sabah.end) {
        timeSlots.Sabah.data.push({ ...med, time });
      } else if (hour >= timeSlots.Öğle.start && hour <= timeSlots.Öğle.end) {
        timeSlots.Öğle.data.push({ ...med, time });
      } else if (hour >= timeSlots.Akşam.start && hour <= timeSlots.Akşam.end) {
        timeSlots.Akşam.data.push({ ...med, time });
      } else { // Gece
        timeSlots.Gece.data.push({ ...med, time });
      }
    });
  });

  // Her bir zaman dilimindeki ilaçları kendi içinde saate göre sırala
  for (const slot in timeSlots) {
    timeSlots[slot].data.sort((a, b) => {
      const timeA = a.time.replace(':', '');
      const timeB = b.time.replace(':', '');
      return timeA.localeCompare(timeB);
    });
  }

  return Object.entries(timeSlots)
    .map(([title, { icon, data }]) => ({ title, icon, data }))
    .filter(slot => slot.data.length > 0);
};
