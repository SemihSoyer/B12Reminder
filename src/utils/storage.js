import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage anahtarları
export const STORAGE_KEYS = {
  MEDICATIONS: 'medications',
  MENSTRUAL: 'menstrual_data',
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

