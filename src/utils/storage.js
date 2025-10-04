import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage anahtarları
export const STORAGE_KEYS = {
  MEDICATIONS: 'medications',
  MENSTRUAL: 'menstrual_data',
  MENSTRUAL_INFO_SHOWN: 'menstrual_info_shown',
  CUSTOM_REMINDERS: 'custom_reminders',
  USER_SETTINGS: 'user_settings',
  BIRTHDAYS: 'birthdays'
};

// Genel storage fonksiyonları
export const StorageService = {
  // Veri kaydetme
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  },

  // Veri okuma
  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  },

  // Veri silme
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  },

  // Tüm verileri temizle
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

// Doğum günü servisi
export const BirthdayService = {
  // Tüm doğum günlerini getir
  async getAllBirthdays() {
    try {
      const birthdays = await StorageService.getItem(STORAGE_KEYS.BIRTHDAYS);
      if (!birthdays || !Array.isArray(birthdays)) {
        return [];
      }
      
      // Kalan günleri yeniden hesapla ve süresi geçenleri filtrele
      const validBirthdays = birthdays
        .filter(birthday => {
          // Temel veri kontrolü
          return birthday && 
                 typeof birthday === 'object' && 
                 birthday.name && 
                 birthday.date &&
                 typeof birthday.name === 'string' &&
                 typeof birthday.date === 'string';
          // Note alanı isteğe bağlı, kontrol etmiyoruz
        })
        .map(birthday => ({
          ...birthday,
          daysLeft: this.calculateDaysLeft(birthday.date)
        }))
        .filter(birthday => {
          // Sadece bu yıl ve gelecek yıl doğum günlerini tut
          return birthday.daysLeft >= 0 && birthday.daysLeft <= 365;
        });
      
      // Temizlenmiş listeyi kaydet
      await StorageService.setItem(STORAGE_KEYS.BIRTHDAYS, validBirthdays);
      
      return validBirthdays;
    } catch (error) {
      console.error('Error getting birthdays:', error);
      return [];
    }
  },

  // Yeni doğum günü ekle
  async addBirthday(birthday) {
    try {
      const currentBirthdays = await this.getAllBirthdays();
      const newBirthday = {
        ...birthday,
        id: `birthday_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        daysLeft: this.calculateDaysLeft(birthday.date)
      };
      
      const updatedBirthdays = [...currentBirthdays, newBirthday];
      await StorageService.setItem(STORAGE_KEYS.BIRTHDAYS, updatedBirthdays);
      
      return newBirthday;
    } catch (error) {
      console.error('Error adding birthday:', error);
      return null;
    }
  },

  // Doğum günü sil
  async deleteBirthday(birthdayId) {
    try {
      const currentBirthdays = await this.getAllBirthdays();
      const updatedBirthdays = currentBirthdays.filter(birthday => birthday.id !== birthdayId);
      
      await StorageService.setItem(STORAGE_KEYS.BIRTHDAYS, updatedBirthdays);
      return true;
    } catch (error) {
      console.error('Error deleting birthday:', error);
      return false;
    }
  },

  // Kalan günleri hesapla
  calculateDaysLeft(birthdayDateString) {
    try {
      // Null/undefined kontrolü
      if (!birthdayDateString || typeof birthdayDateString !== 'string') {
        console.warn('Invalid birthday date string:', birthdayDateString);
        return 365;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Saati sıfırla
      
      const currentYear = today.getFullYear();
      
      // Tarih string'ini parse et (örn: "15 Ocak")
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      
      const parts = birthdayDateString.trim().split(' ');
      if (parts.length !== 2) {
        console.warn('Invalid date format:', birthdayDateString);
        return 365;
      }

      const [dayStr, monthName] = parts;
      const day = parseInt(dayStr);
      const monthIndex = monthNames.indexOf(monthName);
      
      if (isNaN(day) || day < 1 || day > 31 || monthIndex === -1) {
        console.warn('Invalid day or month:', { day, monthName });
        return 365;
      }
      
      // Bu yılki doğum günü tarihini oluştur
      let thisYearBirthday = new Date(currentYear, monthIndex, day);
      thisYearBirthday.setHours(0, 0, 0, 0);
      
      // Eğer bu yılki doğum günü bugünden önceyse, gelecek yılki doğum gününü hesapla
      if (thisYearBirthday < today) {
        thisYearBirthday = new Date(currentYear + 1, monthIndex, day);
        thisYearBirthday.setHours(0, 0, 0, 0);
      }
      
      // Gün farkını hesapla
      const diffTime = thisYearBirthday - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diffDays); // Negatif değer dönmesin
    } catch (error) {
      console.error('Tarih hesaplama hatası:', error);
      return 365;
    }
  },

  // Süresi geçen doğum günlerini temizle
  async cleanupExpiredBirthdays() {
    try {
      const currentBirthdays = await this.getAllBirthdays();
      const validBirthdays = currentBirthdays.filter(birthday => {
        const daysLeft = this.calculateDaysLeft(birthday.date);
        return daysLeft >= 0 && daysLeft <= 365;
      });
      
      if (validBirthdays.length !== currentBirthdays.length) {
        await StorageService.setItem(STORAGE_KEYS.BIRTHDAYS, validBirthdays);
        console.log(`${currentBirthdays.length - validBirthdays.length} expired birthdays cleaned up`);
      }
      
      return validBirthdays;
    } catch (error) {
      console.error('Error cleaning up birthdays:', error);
      return [];
    }
  }
};

// İlaç servisi
export const MedicationService = {
  // Tüm ilaçları getir
  async getAllMedications() {
    try {
      const medications = await StorageService.getItem(STORAGE_KEYS.MEDICATIONS);
      return medications || [];
    } catch (error) {
      console.error('Error getting medications:', error);
      return [];
    }
  },

  // Yeni ilaç ekle
  async addMedication(medication) {
    try {
      const currentMedications = await this.getAllMedications();
      const newMedication = {
        ...medication,
        id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      
      const updatedMedications = [...currentMedications, newMedication];
      await StorageService.setItem(STORAGE_KEYS.MEDICATIONS, updatedMedications);
      
      return newMedication;
    } catch (error) {
      console.error('Error adding medication:', error);
      return null;
    }
  },

  // İlaç sil
  async deleteMedication(medicationId) {
    try {
      const currentMedications = await this.getAllMedications();
      const updatedMedications = currentMedications.filter(med => med.id !== medicationId);
      
      await StorageService.setItem(STORAGE_KEYS.MEDICATIONS, updatedMedications);
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      return false;
    }
  },
};

// Regl takip servisi
export const MenstrualService = {
  // Regl verilerini getir
  async getMenstrualData() {
    try {
      const data = await StorageService.getItem(STORAGE_KEYS.MENSTRUAL);
      if (!data) {
        return {
          cycles: [],
          averageCycleLength: 28,
          averagePeriodLength: 5,
          lastPeriodStart: null,
        };
      }
      
      // Döngüleri tarihe göre sırala (en yeni en sonda)
      if (data.cycles && data.cycles.length > 0) {
        data.cycles = data.cycles.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateA - dateB;
        });
        
        // lastPeriodStart'ı en son döngüden al
        const latestCycle = data.cycles[data.cycles.length - 1];
        data.lastPeriodStart = latestCycle.startDate;
      }
      
      // Varsayılan değerleri kontrol et
      if (!data.averageCycleLength || data.averageCycleLength < 21 || data.averageCycleLength > 45) {
        data.averageCycleLength = 28;
      }
      
      if (!data.averagePeriodLength || data.averagePeriodLength < 3 || data.averagePeriodLength > 10) {
        data.averagePeriodLength = 5;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting menstrual data:', error);
      return {
        cycles: [],
        averageCycleLength: 28,
        averagePeriodLength: 5,
        lastPeriodStart: null,
      };
    }
  },

  // Yeni regl dönemi başlat
  async startNewPeriod(startDate, periodLength = 5) {
    try {
      const data = await this.getMenstrualData();
      
      const newCycle = {
        id: `cycle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startDate: startDate,
        endDate: null,
        periodLength: periodLength,
        cycleLength: null,
        createdAt: new Date().toISOString(),
      };

      // Tarihlere göre sırala (en eski önce)
      const sortedCycles = [...data.cycles].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });

      // Eğer önceki döngü varsa, döngü süresini hesapla
      if (sortedCycles.length > 0) {
        const lastCycle = sortedCycles[sortedCycles.length - 1];
        const previousStart = new Date(lastCycle.startDate);
        const currentStart = new Date(startDate);
        
        previousStart.setHours(0, 0, 0, 0);
        currentStart.setHours(0, 0, 0, 0);
        
        // Sadece yeni tarih önceki tarihten sonraysa hesapla
        if (currentStart > previousStart) {
          const daysBetween = Math.floor((currentStart - previousStart) / (1000 * 60 * 60 * 24));
          
          // Makul bir döngü süresi kontrolü (15-60 gün arası)
          if (daysBetween >= 15 && daysBetween <= 60) {
            lastCycle.cycleLength = daysBetween;
            
            // Güncellenmiş son döngüyü dizide bul ve güncelle
            const cycleIndex = data.cycles.findIndex(c => c.id === lastCycle.id);
            if (cycleIndex !== -1) {
              data.cycles[cycleIndex] = lastCycle;
            }
          }
        }
      }

      // Yeni döngüyü ekle
      data.cycles.push(newCycle);
      
      // En son regl tarihini güncelle (en yeni tarih)
      data.lastPeriodStart = startDate;

      // Ortalama döngü süresini yeniden hesapla (sadece geçerli değerlerle)
      const cyclesWithLength = data.cycles.filter(c => 
        c.cycleLength !== null && 
        c.cycleLength >= 21 && 
        c.cycleLength <= 35
      );
      
      if (cyclesWithLength.length > 0) {
        const totalLength = cyclesWithLength.reduce((sum, c) => sum + c.cycleLength, 0);
        data.averageCycleLength = Math.round(totalLength / cyclesWithLength.length);
      } else {
        // Varsayılan değer
        data.averageCycleLength = 28;
      }

      // Ortalama regl süresini yeniden hesapla
      const cyclesWithPeriod = data.cycles.filter(c => 
        c.periodLength !== null && 
        c.periodLength >= 3 && 
        c.periodLength <= 10
      );
      
      if (cyclesWithPeriod.length > 0) {
        const totalPeriod = cyclesWithPeriod.reduce((sum, c) => sum + c.periodLength, 0);
        data.averagePeriodLength = Math.round(totalPeriod / cyclesWithPeriod.length);
      } else {
        // Varsayılan değer
        data.averagePeriodLength = 5;
      }

      await StorageService.setItem(STORAGE_KEYS.MENSTRUAL, data);
      return data;
    } catch (error) {
      console.error('Error starting new period:', error);
      throw error;
    }
  },

  // Regl dönemi güncelle (bitiş tarihi, döngü bilgileri)
  async updatePeriod(cycleId, updates) {
    try {
      const data = await this.getMenstrualData();
      const cycleIndex = data.cycles.findIndex(c => c.id === cycleId);
      
      if (cycleIndex !== -1) {
        data.cycles[cycleIndex] = {
          ...data.cycles[cycleIndex],
          ...updates,
        };
        
        await StorageService.setItem(STORAGE_KEYS.MENSTRUAL, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error updating period:', error);
      return null;
    }
  },

  // Regl döngüsünü sil
  async deleteCycle(cycleId) {
    try {
      const data = await this.getMenstrualData();
      data.cycles = data.cycles.filter(c => c.id !== cycleId);
      
      // Döngüleri tarihe göre sırala
      data.cycles.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
      
      // Son regl tarihini güncelle (en yeni tarih)
      if (data.cycles.length > 0) {
        data.lastPeriodStart = data.cycles[data.cycles.length - 1].startDate;
      } else {
        data.lastPeriodStart = null;
      }
      
      // Ortalamaları yeniden hesapla
      const cyclesWithLength = data.cycles.filter(c => 
        c.cycleLength !== null && 
        c.cycleLength >= 21 && 
        c.cycleLength <= 35
      );
      
      if (cyclesWithLength.length > 0) {
        const totalLength = cyclesWithLength.reduce((sum, c) => sum + c.cycleLength, 0);
        data.averageCycleLength = Math.round(totalLength / cyclesWithLength.length);
      } else {
        data.averageCycleLength = 28;
      }
      
      await StorageService.setItem(STORAGE_KEYS.MENSTRUAL, data);
      return true;
    } catch (error) {
      console.error('Error deleting cycle:', error);
      return false;
    }
  },

  // Tüm regl verilerini sıfırla
  async resetAllData() {
    try {
      await StorageService.removeItem(STORAGE_KEYS.MENSTRUAL);
      return true;
    } catch (error) {
      console.error('Error resetting menstrual data:', error);
      return false;
    }
  },

  // İlk açılış bilgisi kontrolü
  async hasSeenInfo() {
    try {
      const value = await StorageService.getItem(STORAGE_KEYS.MENSTRUAL_INFO_SHOWN);
      return value === true;
    } catch (error) {
      console.error('Error checking info status:', error);
      return false;
    }
  },

  // İlk açılış bilgisini kaydet
  async setInfoShown(value = true) {
    try {
      if (value === false) {
        await StorageService.removeItem(STORAGE_KEYS.MENSTRUAL_INFO_SHOWN);
      } else {
        await StorageService.setItem(STORAGE_KEYS.MENSTRUAL_INFO_SHOWN, true);
      }
      return true;
    } catch (error) {
      console.error('Error setting info status:', error);
      return false;
    }
  },
};

// Özel hatırlatıcı servisi
export const CustomReminderService = {
  // Tüm özel hatırlatıcıları getir
  async getAllReminders() {
    try {
      const reminders = await StorageService.getItem(STORAGE_KEYS.CUSTOM_REMINDERS);
      if (!reminders || !Array.isArray(reminders)) {
        return [];
      }
      
      // Aktif hatırlatıcıları filtrele ve sırala
      const activeReminders = reminders
        .filter(reminder => {
          return reminder && 
                 typeof reminder === 'object' && 
                 reminder.title && 
                 reminder.date &&
                 reminder.time;
        })
        .map(reminder => ({
          ...reminder,
          daysLeft: this.calculateDaysLeft(reminder.date)
        }))
        .filter(reminder => reminder.daysLeft >= 0); // Sadece gelecek ve bugünkü hatırlatıcıları tut
      
      return activeReminders;
    } catch (error) {
      console.error('Error getting custom reminders:', error);
      return [];
    }
  },

  // Yeni özel hatırlatıcı ekle
  async addReminder(reminder) {
    try {
      const currentReminders = await this.getAllReminders();
      
      // Maksimum 10 hatırlatıcı kontrolü
      if (currentReminders.length >= 10) {
        throw new Error('Maksimum 10 hatırlatıcı ekleyebilirsiniz.');
      }
      
      const newReminder = {
        ...reminder,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        daysLeft: this.calculateDaysLeft(reminder.date)
      };
      
      const updatedReminders = [...currentReminders, newReminder];
      await StorageService.setItem(STORAGE_KEYS.CUSTOM_REMINDERS, updatedReminders);
      
      return newReminder;
    } catch (error) {
      console.error('Error adding custom reminder:', error);
      throw error;
    }
  },

  // Özel hatırlatıcı sil
  async deleteReminder(reminderId) {
    try {
      const currentReminders = await this.getAllReminders();
      const updatedReminders = currentReminders.filter(reminder => reminder.id !== reminderId);
      
      await StorageService.setItem(STORAGE_KEYS.CUSTOM_REMINDERS, updatedReminders);
      return true;
    } catch (error) {
      console.error('Error deleting custom reminder:', error);
      return false;
    }
  },

  // Kalan günleri hesapla
  calculateDaysLeft(dateString) {
    try {
      if (!dateString || typeof dateString !== 'string') {
        return 0;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const targetDate = new Date(dateString);
      targetDate.setHours(0, 0, 0, 0);
      
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diffDays);
    } catch (error) {
      console.error('Error calculating days left:', error);
      return 0;
    }
  },

  // Süresi geçen hatırlatıcıları temizle
  async cleanupExpiredReminders() {
    try {
      const currentReminders = await this.getAllReminders();
      const validReminders = currentReminders.filter(reminder => {
        const daysLeft = this.calculateDaysLeft(reminder.date);
        return daysLeft >= 0;
      });
      
      if (validReminders.length !== currentReminders.length) {
        await StorageService.setItem(STORAGE_KEYS.CUSTOM_REMINDERS, validReminders);
        console.log(`${currentReminders.length - validReminders.length} expired custom reminders cleaned up`);
      }
      
      return validReminders;
    } catch (error) {
      console.error('Error cleaning up custom reminders:', error);
      return [];
    }
  }
};

