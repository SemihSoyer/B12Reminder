import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage anahtarları
export const STORAGE_KEYS = {
  BIRTHDAYS: 'birthdays',
  MEDICATIONS: 'medications',
  MENSTRUAL: 'menstrual_data',
  CUSTOM_REMINDERS: 'custom_reminders',
  USER_SETTINGS: 'user_settings'
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

// Doğum günü hatırlatıcı servisleri
export const BirthdayService = {
  // Tüm doğum günlerini getir
  async getBirthdays() {
    const birthdays = await StorageService.getItem(STORAGE_KEYS.BIRTHDAYS);
    return birthdays || [];
  },

  // Yeni doğum günü ekle
  async addBirthday(birthdayData) {
    try {
      const birthdays = await this.getBirthdays();
      // Daha güvenli unique ID oluştur
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const uniqueId = `birthday_${timestamp}_${random}`;
      
      const newBirthday = {
        id: uniqueId,
        ...birthdayData,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      birthdays.push(newBirthday);
      const success = await StorageService.setItem(STORAGE_KEYS.BIRTHDAYS, birthdays);
      
      if (success) {
        return { success: true, data: newBirthday };
      } else {
        return { success: false, error: 'Kaydetme hatası' };
      }
    } catch (error) {
      console.error('Error adding birthday:', error);
      return { success: false, error: error.message };
    }
  },

  // Doğum günü güncelle
  async updateBirthday(id, updates) {
    try {
      const birthdays = await this.getBirthdays();
      const index = birthdays.findIndex(b => b.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Doğum günü bulunamadı' };
      }
      
      birthdays[index] = {
        ...birthdays[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const success = await StorageService.setItem(STORAGE_KEYS.BIRTHDAYS, birthdays);
      return { success, data: success ? birthdays[index] : null };
    } catch (error) {
      console.error('Error updating birthday:', error);
      return { success: false, error: error.message };
    }
  },

  // Doğum günü sil
  async deleteBirthday(id) {
    try {
      const birthdays = await this.getBirthdays();
      console.log('Before delete - Total birthdays:', birthdays.length);
      console.log('Deleting ID:', id);
      console.log('All IDs:', birthdays.map(b => b.id));
      
      const filteredBirthdays = birthdays.filter(b => b.id !== id);
      console.log('After filter - Remaining birthdays:', filteredBirthdays.length);
      
      const success = await StorageService.setItem(STORAGE_KEYS.BIRTHDAYS, filteredBirthdays);
      
      if (success) {
        console.log('Successfully deleted birthday with ID:', id);
      }
      
      return { success };
    } catch (error) {
      console.error('Error deleting birthday:', error);
      return { success: false, error: error.message };
    }
  },

  // Yaklaşan doğum günlerini getir (X gün içinde)
  async getUpcomingBirthdays(daysAhead = 30) {
    try {
      const birthdays = await this.getBirthdays();
      const today = new Date();
      const upcoming = [];

      birthdays.forEach(birthday => {
        if (!birthday.isActive) return;

        const [month, day] = birthday.birthDate.split('-').slice(1);
        const thisYear = today.getFullYear();
        let birthdayThisYear = new Date(thisYear, parseInt(month) - 1, parseInt(day));
        
        // Eğer bu yılki doğum günü geçtiyse, gelecek yılkini kontrol et
        if (birthdayThisYear < today) {
          birthdayThisYear = new Date(thisYear + 1, parseInt(month) - 1, parseInt(day));
        }
        
        const daysUntil = Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= daysAhead) {
          upcoming.push({
            ...birthday,
            daysUntil,
            nextBirthday: birthdayThisYear.toISOString()
          });
        }
      });

      return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
    } catch (error) {
      console.error('Error getting upcoming birthdays:', error);
      return [];
    }
  }
};
