import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Platform } from 'react-native';

// RevenueCat API Key
const API_KEY = 'appl_HmtgXBDCxqjJUjiLfTiFEvGlcVE';

// Entitlement identifier
export const ENTITLEMENT_ID = 'Premium';

class RevenueCatService {
  /**
   * RevenueCat'i başlat
   */
  static async initialize() {
    try {
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: API_KEY });
      }
      console.log('RevenueCat başarıyla başlatıldı');
    } catch (error) {
      console.error('RevenueCat başlatma hatası:', error);
    }
  }

  /**
   * Kullanıcının premium üyeliğini kontrol et
   */
  static async isPremium() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch (error) {
      console.error('Premium kontrol hatası:', error);
      return false;
    }
  }

  /**
   * RevenueCat'in hazır paywall ekranını göster
   * @param {string} offeringIdentifier - Offering identifier (default: "default")
   */
  static async presentPaywall(offeringIdentifier = 'default') {
    try {
      const paywallResult = await RevenueCatUI.presentPaywall({
        offering: offeringIdentifier,
      });

      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          // You can get the CustomerInfo object from the paywall result.
          // This is not available in the switch statement, so we'll fetch it manually.
          const customerInfo = await Purchases.getCustomerInfo();
          return { success: true, isPremium: true, customerInfo };

        case PAYWALL_RESULT.CANCELLED:
          return { success: false, cancelled: true };

        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.NOT_PRESENTED:
        default:
          return { success: false, error: 'Paywall could not be presented.' };
      }
    } catch (error) {
      console.error('Paywall gösterme hatası:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * RevenueCat'in hazır paywall footer'ını göster
   * Mevcut ekranınızın altına paywall eklemek için kullanılır
   */
  static async presentPaywallFooter(offeringIdentifier = 'default') {
    console.warn("presentPaywallFooter is not available in this version of the UI SDK.");
    return { success: false, error: "Not implemented" };
  }

  /**
   * Abonelikleri geri yükle
   */
  static async restorePurchases() {
    try {
      const customerInfo = await Purchases.restorePurchases();
      
      // Premium kontrolü
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        return { success: true, isPremium: true, customerInfo };
      }
      
      return { success: true, isPremium: false, message: 'Geri yüklenecek abonelik bulunamadı' };
    } catch (error) {
      console.error('Geri yükleme hatası:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Müşteri bilgilerini getir
   */
  static async getCustomerInfo() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Müşteri bilgisi getirme hatası:', error);
      return null;
    }
  }

  /**
   * Aktif abonelik bilgilerini getir
   */
  static async getActiveSubscription() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      
      if (!entitlement) {
        return null;
      }

      return {
        productIdentifier: entitlement.productIdentifier,
        willRenew: entitlement.willRenew,
        periodType: entitlement.periodType,
        expirationDate: entitlement.expirationDate,
        latestPurchaseDate: entitlement.latestPurchaseDate,
      };
    } catch (error) {
      console.error('Abonelik bilgisi getirme hatası:', error);
      return null;
    }
  }

  /**
   * Mevcut offerings'i (ürünleri) getir
   */
  static async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Offerings getirme hatası:', error);
      return null;
    }
  }
}

export default RevenueCatService;

