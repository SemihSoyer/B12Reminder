/**
 * Regl takibi için yardımcı fonksiyonlar
 */

/**
 * Sonraki regl tarihini tahmin eder
 */
export const predictNextPeriod = (lastPeriodStart, averageCycleLength = 28) => {
  if (!lastPeriodStart) return null;
  
  try {
    const lastDate = new Date(lastPeriodStart);
    lastDate.setHours(0, 0, 0, 0);
    
    // Eğer tarih geçersizse null dön
    if (isNaN(lastDate.getTime())) {
      console.error('Invalid date:', lastPeriodStart);
      return null;
    }
    
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + averageCycleLength);
    nextDate.setHours(0, 0, 0, 0);
    
    return nextDate;
  } catch (error) {
    console.error('Error predicting next period:', error);
    return null;
  }
};

/**
 * Verimli (fertile) günleri hesaplar
 * Ovülasyon genellikle bir sonraki regl öncesi 14 gün önce gerçekleşir
 * Verimli pencere: ovülasyondan 5 gün önce ve 1 gün sonra
 */
export const calculateFertileWindow = (nextPeriodDate) => {
  if (!nextPeriodDate) return { start: null, end: null, ovulationDay: null };
  
  const ovulationDate = new Date(nextPeriodDate);
  ovulationDate.setDate(ovulationDate.getDate() - 14);
  
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);
  
  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);
  
  return {
    start: fertileStart,
    end: fertileEnd,
    ovulationDay: ovulationDate,
  };
};

/**
 * Bir tarihin regl dönemi içinde olup olmadığını kontrol eder
 */
export const isDateInPeriod = (date, periodStart, periodLength = 5) => {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(periodStart);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + periodLength - 1);
  
  return checkDate >= startDate && checkDate <= endDate;
};

/**
 * Bir tarihin verimli dönem içinde olup olmadığını kontrol eder
 */
export const isDateInFertileWindow = (date, fertileWindow) => {
  if (!fertileWindow.start || !fertileWindow.end) return false;
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(fertileWindow.start);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(fertileWindow.end);
  end.setHours(0, 0, 0, 0);
  
  return checkDate >= start && checkDate <= end;
};

/**
 * Sonraki regle kaç gün kaldığını hesaplar
 * Pozitif: Henüz gelmedi, kaç gün kaldı
 * Negatif: Gecikmiş, kaç gün gecikti
 * 0: Bugün bekleniyor
 */
export const daysUntilNextPeriod = (nextPeriodDate) => {
  if (!nextPeriodDate) return null;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const next = new Date(nextPeriodDate);
    next.setHours(0, 0, 0, 0);
    
    // Tarih geçersizse null dön
    if (isNaN(next.getTime())) {
      console.error('Invalid next period date:', nextPeriodDate);
      return null;
    }
    
    const diffTime = next - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating days until next period:', error);
    return null;
  }
};

/**
 * İki tarih arasındaki gün farkını hesaplar
 */
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);
  
  const d2 = new Date(date2);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Döngü faz bilgisini döndürür
 * Döngü günü: Son regl başlangıcından bugüne kaç gün geçti
 */
export const getCurrentPhase = (lastPeriodStart, averageCycleLength = 28, averagePeriodLength = 5) => {
  if (!lastPeriodStart) {
    return { phase: 'none', description: 'Veri yok', color: '#95A5A6', icon: 'help-circle' };
  }
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastStart = new Date(lastPeriodStart);
    lastStart.setHours(0, 0, 0, 0);
    
    // Tarih kontrolü
    if (isNaN(lastStart.getTime())) {
      console.error('Invalid last period start date:', lastPeriodStart);
      return { phase: 'none', description: 'Veri yok', color: '#95A5A6', icon: 'help-circle' };
    }
    
    // Son regl başlangıcından bugüne kaç gün geçti
    const daysSinceLastPeriod = Math.floor((today - lastStart) / (1000 * 60 * 60 * 24));
    const dayOfCycle = daysSinceLastPeriod + 1; // 1. gün = regl başlangıcı
    
    // Eğer son regl gelecekte ise (hatalı veri)
    if (dayOfCycle < 1) {
      return {
        phase: 'future',
        description: 'Gelecek Tarih',
        color: '#95A5A6',
        icon: 'help-circle',
        dayOfCycle: 0,
      };
    }
    
    // 1. Regl Dönemi (1-averagePeriodLength gün)
    if (dayOfCycle >= 1 && dayOfCycle <= averagePeriodLength) {
      return {
        phase: 'menstruation',
        description: 'Regl Dönemi',
        color: '#E17055',
        icon: 'water',
        dayOfCycle,
      };
    }
    
    // 2. Foliküler Faz (regl sonu - ovülasyondan önce)
    // Ovülasyon genellikle döngünün 14. günü civarında (28 günlük döngüde)
    const ovulationDay = averageCycleLength - 14; // Ovülasyon, sonraki reglden 14 gün önce
    
    if (dayOfCycle > averagePeriodLength && dayOfCycle < ovulationDay - 2) {
      return {
        phase: 'follicular',
        description: 'Foliküler Faz',
        color: '#74B9FF',
        icon: 'flower',
        dayOfCycle,
      };
    }
    
    // 3. Ovülasyon Dönemi (±2-3 gün pencere)
    if (dayOfCycle >= ovulationDay - 2 && dayOfCycle <= ovulationDay + 2) {
      return {
        phase: 'ovulation',
        description: 'Ovülasyon Dönemi',
        color: '#00B894',
        icon: 'leaf',
        dayOfCycle,
      };
    }
    
    // 4. Luteal Faz (ovülasyon sonrası - bir sonraki regl)
    if (dayOfCycle > ovulationDay + 2 && dayOfCycle <= averageCycleLength) {
      return {
        phase: 'luteal',
        description: 'Luteal Faz',
        color: '#A29BFE',
        icon: 'moon',
        dayOfCycle,
      };
    }
    
    // 5. Regl Gecikmesi (beklenen döngü süresini geçti)
    // Ancak sadece 7 güne kadar tolerans göster
    if (dayOfCycle > averageCycleLength && dayOfCycle <= averageCycleLength + 7) {
      const daysLate = dayOfCycle - averageCycleLength;
      return {
        phase: 'late',
        description: `${daysLate} Gün Gecikme`,
        color: '#FF6A88',
        icon: 'alert-circle',
        dayOfCycle,
      };
    }
    
    // 6. Çok Geç (7 günden fazla gecikme - yeni döngü başlamış olabilir)
    if (dayOfCycle > averageCycleLength + 7) {
      return {
        phase: 'very_late',
        description: 'Önemli Gecikme',
        color: '#D63031',
        icon: 'warning',
        dayOfCycle,
      };
    }
    
    // Varsayılan
    return {
      phase: 'unknown',
      description: 'Bilinmiyor',
      color: '#95A5A6',
      icon: 'help-circle',
      dayOfCycle,
    };
  } catch (error) {
    console.error('Error calculating current phase:', error);
    return { phase: 'error', description: 'Hata', color: '#95A5A6', icon: 'help-circle' };
  }
};

/**
 * Tarih formatını düzenler
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = d.getDate();
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  
  return `${day} ${month} ${year}`;
};

/**
 * Kısa tarih formatı (gün/ay)
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  
  return `${day}/${month}`;
};

/**
 * Döngü düzenlilik skorunu hesaplar (0-100)
 */
export const calculateCycleRegularity = (cycles) => {
  if (cycles.length < 2) return null;
  
  const cycleLengths = cycles
    .filter(c => c.cycleLength !== null && c.cycleLength > 0)
    .map(c => c.cycleLength);
  
  if (cycleLengths.length < 2) return null;
  
  // Standart sapma hesapla
  const average = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  const variance = cycleLengths.reduce((sum, length) => sum + Math.pow(length - average, 2), 0) / cycleLengths.length;
  const stdDev = Math.sqrt(variance);
  
  // 0-100 arası skora dönüştür (düşük sapma = yüksek skor)
  const maxStdDev = 7; // 7 günden fazla sapma düzensiz kabul edilir
  const regularity = Math.max(0, Math.min(100, 100 - (stdDev / maxStdDev) * 100));
  
  return Math.round(regularity);
};

