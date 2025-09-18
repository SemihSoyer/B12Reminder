import { BirthdayService, StorageService, STORAGE_KEYS } from './storage';

// Debug fonksiyonları - sadece development için
export const DebugStorage = {
  // Tüm doğum günlerini logla
  async logAllBirthdays() {
    try {
      const birthdays = await BirthdayService.getBirthdays();
      console.log('=== ALL BIRTHDAYS ===');
      console.log('Total count:', birthdays.length);
      birthdays.forEach((birthday, index) => {
        console.log(`${index + 1}.`, {
          id: birthday.id,
          name: birthday.name,
          birthDate: birthday.birthDate,
          createdAt: birthday.createdAt
        });
      });
      console.log('===================');
      return birthdays;
    } catch (error) {
      console.error('Error logging birthdays:', error);
    }
  },

  // Tüm doğum günlerini sil
  async clearAllBirthdays() {
    try {
      const success = await StorageService.removeItem(STORAGE_KEYS.BIRTHDAYS);
      if (success) {
        console.log('✅ All birthdays cleared successfully');
      } else {
        console.log('❌ Failed to clear birthdays');
      }
      return success;
    } catch (error) {
      console.error('Error clearing birthdays:', error);
      return false;
    }
  },

  // Raw storage'ı kontrol et
  async checkRawStorage() {
    try {
      const raw = await StorageService.getItem(STORAGE_KEYS.BIRTHDAYS);
      console.log('=== RAW STORAGE ===');
      console.log('Raw data:', raw);
      console.log('Type:', typeof raw);
      console.log('Is Array:', Array.isArray(raw));
      if (raw) {
        console.log('Length:', raw.length);
      }
      console.log('==================');
      return raw;
    } catch (error) {
      console.error('Error checking raw storage:', error);
    }
  }
};

// Global olarak erişilebilir yap (sadece development)
if (__DEV__) {
  global.debugStorage = DebugStorage;
  console.log('🔧 Debug storage available: debugStorage.logAllBirthdays(), debugStorage.clearAllBirthdays()');
}
