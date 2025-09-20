import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage anahtarları
export const STORAGE_KEYS = {
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

