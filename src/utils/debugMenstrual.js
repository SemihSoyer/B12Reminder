/**
 * Debug: Regl verilerini temizle ve sıfırla
 * Bu fonksiyonu konsol üzerinden çağırabilirsiniz
 */

import { MenstrualService } from './storage';

export const debugMenstrualData = async () => {
  try {
    const data = await MenstrualService.getMenstrualData();
    console.log('=== CURRENT MENSTRUAL DATA ===');
    console.log('lastPeriodStart:', data.lastPeriodStart);
    console.log('averageCycleLength:', data.averageCycleLength);
    console.log('averagePeriodLength:', data.averagePeriodLength);
    console.log('Cycle count:', data.cycles.length);
    console.log('Cycles:', JSON.stringify(data.cycles, null, 2));
    return data;
  } catch (error) {
    console.error('Debug error:', error);
  }
};

export const resetMenstrualData = async () => {
  try {
    await MenstrualService.resetAllData();
    // İlk açılış bilgisini de sıfırla ki modal tekrar gösterilsin
    await MenstrualService.setInfoShown(false);
    console.log('✅ All menstrual data cleared!');
    console.log('✅ First launch modal will be shown again.');
    console.log('Now you can start a new cycle.');
    return true;
  } catch (error) {
    console.error('Reset error:', error);
    return false;
  }
};

export const fixMenstrualData = async () => {
  try {
    const data = await MenstrualService.getMenstrualData();
    
    console.log('=== DATA FIXING STARTED ===');
    
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
      console.log('✅ lastPeriodStart updated:', data.lastPeriodStart);
    }
    
    // Anormal döngü uzunluklarını temizle
    data.cycles.forEach(cycle => {
      if (cycle.cycleLength !== null) {
        if (cycle.cycleLength < 21 || cycle.cycleLength > 45) {
          console.log('⚠️ Anormal cycle length being deleted:', cycle.cycleLength);
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
    
    console.log('✅ Average cycle:', data.averageCycleLength);
    
    await MenstrualService.updatePeriod(null, data);
    console.log('✅ Data fixed!');
    
    return data;
  } catch (error) {
    console.error('Fix error:', error);
    return null;
  }
};

