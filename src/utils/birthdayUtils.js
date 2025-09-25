/**
 * Doğum günü hatırlatıcıları için yardımcı fonksiyonlar
 */

// Türkçe ay isimleri
export const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

/**
 * İki tarih arasındaki gün farkını hesaplar
 */
export const calculateDaysLeft = (birthdayDateString) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Tarih string'ini parse et (örn: "15 Ocak")
    const [day, monthName] = birthdayDateString.split(' ');
    const monthIndex = MONTH_NAMES.indexOf(monthName);
    
    if (monthIndex === -1) {
      return 0; // Geçersiz ay ismi
    }
    
    // Bu yılki doğum günü tarihini oluştur
    let thisYearBirthday = new Date(currentYear, monthIndex, parseInt(day));
    
    // Eğer bu yılki doğum günü geçmişse, gelecek yılki doğum gününü hesapla
    if (thisYearBirthday < today) {
      thisYearBirthday = new Date(currentYear + 1, monthIndex, parseInt(day));
    }
    
    // Gün farkını hesapla
    const diffTime = thisYearBirthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Tarih hesaplama hatası:', error);
    return 0;
  }
};

/**
 * Doğum günü listesini anasayfa hatırlatıcı formatına çevirir
 */
export const convertBirthdaysToReminders = (birthdays) => {
  if (!birthdays || !Array.isArray(birthdays)) {
    return [];
  }
  
  return birthdays.map(birthday => ({
    icon: '🎂',
    title: `${birthday.name}'in Doğum Günü`,
    time: '00:00', // Varsayılan saat
    date: birthday.date,
    daysLeft: birthday.daysLeft,
    category: 'Doğum Günü',
    categoryColor: '#FF6A88',
    gradientColors: ['#FECACA', '#FED7E2']
  }));
};

/**
 * Bugünkü doğum günlerini filtreler
 */
export const getTodaysBirthdays = (birthdays) => {
  if (!birthdays || !Array.isArray(birthdays)) {
    return [];
  }
  
  return birthdays.filter(birthday => birthday.daysLeft === 0);
};

/**
 * Yaklaşan doğum günlerini filtreler (bugün hariç)
 */
export const getUpcomingBirthdays = (birthdays, maxDays = 30) => {
  if (!birthdays || !Array.isArray(birthdays)) {
    return [];
  }
  
  return birthdays
    .filter(birthday => birthday.daysLeft > 0 && birthday.daysLeft <= maxDays)
    .sort((a, b) => a.daysLeft - b.daysLeft); // Yakın olana göre sırala
};

/**
 * Doğum günü verilerini AsyncStorage formatına çevirir
 */
export const formatBirthdaysForStorage = (birthdays) => {
  if (!birthdays || !Array.isArray(birthdays)) {
    return [];
  }
  
  return birthdays.map(birthday => ({
    ...birthday,
    id: `birthday_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    type: 'birthday'
  }));
};

/**
 * AsyncStorage'dan gelen verileri doğum günü formatına çevirir
 */
export const parseBirthdaysFromStorage = (storedData) => {
  if (!storedData || !Array.isArray(storedData)) {
    return [];
  }
  
  return storedData
    .filter(item => item.type === 'birthday')
    .map(item => ({
      name: item.name,
      date: item.date,
      daysLeft: calculateDaysLeft(item.date) // Kalan günleri yeniden hesapla
    }));
};

export const transformBirthdaysToReminders = (birthdays) => {
  const todayReminders = [];
  const upcomingReminders = [];

  if (!birthdays || !Array.isArray(birthdays)) {
    return { todayReminders: [], upcomingReminders: [] };
  }

  birthdays.forEach(birthday => {
    // daysLeft'in bir sayı olduğundan emin olalım
    if (typeof birthday.daysLeft !== 'number') {
      return; // veya varsayılan bir değer ata
    }

    if (birthday.daysLeft === 0) {
      todayReminders.push({
        id: `birthday-${birthday.id}`,
        originalId: birthday.id, // Orijinal ID'yi ekliyoruz
        reminderType: 'birthday',
        time: 'Bugün',
        title: `${birthday.name}'in doğum günü!`,
        iconConfig: { 
          name: 'gift', 
          color: '#FF6A88', 
          backgroundColor: 'rgba(255, 106, 136, 0.1)' 
        },
      });
    } 
    // Gelecekteki 1 yıl içindeki doğum günlerini al
    else if (birthday.daysLeft > 0 && birthday.daysLeft <= 365) { 
      upcomingReminders.push({
        id: `birthday-${birthday.id}`,
        originalId: birthday.id, // Orijinal ID'yi ekliyoruz
        reminderType: 'birthday',
        time: `${birthday.date}`, // Orijinal tarihi gösterelim
        title: `${birthday.name}'in doğum günü`,
        details: `${birthday.daysLeft} gün kaldı`,
        iconConfig: { 
          name: 'gift', 
          color: '#00B894', 
          backgroundColor: 'rgba(0, 184, 148, 0.1)' 
        },
      });
    }
  });

  // Yaklaşan hatırlatıcıları gün sayısına göre sırala (en yakın olan önce)
  upcomingReminders.sort((a, b) => {
    // 'details' alanından gün sayısını çıkarıp karşılaştıralım
    const daysA = a.details ? parseInt(a.details.split(' ')[0]) : 366;
    const daysB = b.details ? parseInt(b.details.split(' ')[0]) : 366;
    return daysA - daysB;
  });

  return { todayReminders, upcomingReminders };
};
