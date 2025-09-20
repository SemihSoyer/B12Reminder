import { StorageService, STORAGE_KEYS } from './storage';

// Debug fonksiyonları - sadece development için
export const DebugStorage = {
  // Raw storage'ı kontrol et
  async checkRawStorage(key) {
    try {
      const raw = await StorageService.getItem(key);
      console.log('=== RAW STORAGE ===');
      console.log('Key:', key);
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
  },

  // Tüm storage'ı temizle
  async clearAllStorage() {
    try {
      const success = await StorageService.clear();
      if (success) {
        console.log('✅ All storage cleared successfully');
      } else {
        console.log('❌ Failed to clear storage');
      }
      return success;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

// Global olarak erişilebilir yap (sadece development)
if (__DEV__) {
  global.debugStorage = DebugStorage;
  console.log('🔧 Debug storage available: debugStorage.checkRawStorage(key), debugStorage.clearAllStorage()');
}
