/**
 * Debug: Regl verilerini temizle ve sıfırla
 * Bu fonksiyonu konsol üzerinden çağırabilirsiniz
 */

import { MenstrualService } from './storage';

export const debugMenstrualData = async () => {
  try {
    const data = await MenstrualService.getMenstrualData();
    console.log('=== MEVCUT REGL VERİLERİ ===');
    console.log('lastPeriodStart:', data.lastPeriodStart);
    console.log('averageCycleLength:', data.averageCycleLength);
    console.log('averagePeriodLength:', data.averagePeriodLength);
    console.log('Döngü sayısı:', data.cycles.length);
    console.log('Döngüler:', JSON.stringify(data.cycles, null, 2));
    return data;
  } catch (error) {
    console.error('Debug hatası:', error);
  }
};

export const resetMenstrualData = async () => {
  try {
    await MenstrualService.resetAllData();
    // İlk açılış bilgisini de sıfırla ki modal tekrar gösterilsin
    await MenstrualService.setInfoShown(false);
    console.log('✅ Tüm regl verileri temizlendi!');
    console.log('✅ İlk açılış modal\'i tekrar gösterilecek.');
    console.log('Artık yeni bir döngü başlatabilirsiniz.');
    return true;
  } catch (error) {
    console.error('Reset hatası:', error);
    return false;
  }
};

export const fixMenstrualData = async () => {
  try {
    const data = await MenstrualService.getMenstrualData();
    
    console.log('=== VERİ ONARIMI BAŞLADI ===');
    
    // Döngüleri tarihe göre sırala
    data.cycles.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA - dateB;
    });
    
    // En son tarihi bul
    if (data.cycles.length > 0) {
      const latestCycle = data.cycles[data.cycles.length - 1];
      data.lastPeriodStart = latestCycle.startDate;
      console.log('✅ lastPeriodStart güncellendi:', data.lastPeriodStart);
    }
    
    // Anormal döngü uzunluklarını temizle
    data.cycles.forEach(cycle => {
      if (cycle.cycleLength !== null) {
        if (cycle.cycleLength < 21 || cycle.cycleLength > 45) {
          console.log('⚠️ Anormal döngü uzunluğu siliniyor:', cycle.cycleLength);
          cycle.cycleLength = null;
        }
      }
    });
    
    // Ortalamaları yeniden hesapla
    const validCycles = data.cycles.filter(c => 
      c.cycleLength !== null && 
      c.cycleLength >= 21 && 
      c.cycleLength <= 35
    );
    
    if (validCycles.length > 0) {
      const totalLength = validCycles.reduce((sum, c) => sum + c.cycleLength, 0);
      data.averageCycleLength = Math.round(totalLength / validCycles.length);
    } else {
      data.averageCycleLength = 28;
    }
    
    console.log('✅ Ortalama döngü:', data.averageCycleLength);
    
    await MenstrualService.updatePeriod(null, data);
    console.log('✅ Veriler onarıldı!');
    
    return data;
  } catch (error) {
    console.error('Fix hatası:', error);
    return null;
  }
};

