import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';
import RevenueCatService from '../../utils/revenueCatService';

export default function SubscriptionScreen({ navigation }) {
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadSubscriptionInfo();

    // Ekrana her geldiğinde yenile
    const unsubscribe = navigation.addListener('focus', () => {
      loadSubscriptionInfo();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSubscriptionInfo = async () => {
    try {
      setLoading(true);
      const premium = await RevenueCatService.isPremium();
      setIsPremium(premium);

      if (premium) {
        const subInfo = await RevenueCatService.getActiveSubscription();
        setSubscriptionInfo(subInfo);
      }
    } catch (error) {
      console.error('Abonelik bilgisi yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShowPaywall = async () => {
    try {
      const result = await RevenueCatService.presentPaywall('default');

      if (result.success && result.isPremium) {
        Alert.alert(
          'Tebrikler! 🎉',
          'Premium üyeliğiniz başarıyla etkinleştirildi.',
          [
            {
              text: 'Tamam',
              onPress: loadSubscriptionInfo,
            },
          ]
        );
      } else if (result.error) {
        Alert.alert('Hata', result.error);
      }
      // Eğer cancelled ise hiçbir şey yapma
    } catch (error) {
      Alert.alert('Hata', 'Paywall gösterilirken bir hata oluştu.');
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setRestoring(true);
      const result = await RevenueCatService.restorePurchases();

      if (result.success && result.isPremium) {
        Alert.alert(
          'Başarılı! 🎉',
          'Satın alımlarınız başarıyla geri yüklendi.',
          [{ text: 'Tamam', onPress: loadSubscriptionInfo }]
        );
      } else if (result.success && !result.isPremium) {
        Alert.alert('Bilgi', 'Geri yüklenecek satın alım bulunamadı.');
      } else {
        Alert.alert('Hata', result.error || 'Geri yükleme işlemi başarısız oldu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Geri yükleme işlemi sırasında bir hata oluştu.');
    } finally {
      setRestoring(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPeriodTypeText = (periodType) => {
    switch (periodType) {
      case 'NORMAL':
        return 'Aylık';
      case 'ANNUAL':
        return 'Yıllık';
      default:
        return periodType;
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>Abonelikler</Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Abonelikler</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Status Card */}
          <View style={[styles.card, isPremium ? styles.premiumCard : styles.freeCard]}>
            <View style={styles.cardHeader}>
              <View style={styles.statusBadge}>
                <LinearGradient
                  colors={isPremium ? ['#FFD700', '#FFA500'] : ['#E0E0E0', '#BDBDBD']}
                  style={styles.badgeGradient}
                >
                  <Ionicons
                    name={isPremium ? 'star' : 'star-outline'}
                    size={20}
                    color="#FFF"
                  />
                </LinearGradient>
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>
                  {isPremium ? 'Premium Üyelik' : 'Ücretsiz Üyelik'}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {isPremium ? 'Tüm özellikler aktif' : 'Sınırlı özellikler'}
                </Text>
              </View>
              {isPremium && (
                <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              )}
            </View>

            {isPremium && subscriptionInfo && (
              <View style={styles.subscriptionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Abonelik Türü:</Text>
                  <Text style={styles.detailValue}>
                    {getPeriodTypeText(subscriptionInfo.periodType)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Durum:</Text>
                  <Text style={[styles.detailValue, styles.activeStatus]}>
                    {subscriptionInfo.willRenew ? 'Aktif (Yenilenecek)' : 'Aktif (Yenilenmeyecek)'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Satın Alma Tarihi:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(subscriptionInfo.latestPurchaseDate)}
                  </Text>
                </View>
                {subscriptionInfo.expirationDate && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {subscriptionInfo.willRenew ? 'Yenilenme Tarihi:' : 'Bitiş Tarihi:'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatDate(subscriptionInfo.expirationDate)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Features Section */}
          {!isPremium && (
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Premium Özellikleri</Text>
              <View style={styles.featuresList}>
                {[
                  { icon: 'notifications', text: 'Sınırsız hatırlatıcı' },
                  { icon: 'calendar', text: 'Gelişmiş takvim özellikleri' },
                  { icon: 'analytics', text: 'Detaylı istatistikler' },
                  { icon: 'cloud-upload', text: 'Bulut yedekleme' },
                  { icon: 'color-palette', text: 'Özel temalar' },
                  { icon: 'remove-circle', text: 'Reklamsız deneyim' },
                ].map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name={feature.icon} size={22} color="#FF6B6B" />
                    <Text style={styles.featureText}>{feature.text}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleShowPaywall}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.upgradeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="star" size={24} color="#FFF" />
                  <Text style={styles.upgradeButtonText}>Premium'a Geç</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Manage Subscription */}
          {isPremium && (
            <View style={styles.manageSection}>
              <Text style={styles.sectionTitle}>Abonelik Yönetimi</Text>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => {
                  Alert.alert(
                    'Abonelik Yönetimi',
                    'Aboneliğinizi yönetmek için App Store ayarlarınıza gidin.',
                    [
                      { text: 'Tamam', style: 'default' },
                    ]
                  );
                }}
              >
                <Ionicons name="settings-outline" size={24} color="#FF6B6B" />
                <Text style={styles.manageButtonText}>Aboneliği Yönet</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          )}

          {/* Restore Purchases */}
          <View style={styles.restoreSection}>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
              disabled={restoring}
            >
              {restoring ? (
                <ActivityIndicator color="#FF6B6B" />
              ) : (
                <>
                  <Ionicons name="refresh-outline" size={22} color="#FF6B6B" />
                  <Text style={styles.restoreButtonText}>Satın Alımları Geri Yükle</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.restoreDescription}>
              Daha önce satın aldığınız abonelikleri geri yükleyin
            </Text>
          </View>

          {/* Info Note */}
          <View style={styles.infoNote}>
            <Ionicons name="information-circle-outline" size={20} color="#999" />
            <Text style={styles.infoText}>
              Abonelikler Apple hesabınızdan yönetilir ve otomatik olarak yenilenir.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  premiumCard: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  freeCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    marginRight: 12,
  },
  badgeGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  subscriptionDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  activeStatus: {
    color: '#4CAF50',
  },
  featuresSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginLeft: 12,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginLeft: 8,
  },
  manageSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  manageButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginLeft: 12,
  },
  restoreSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    minHeight: 48,
  },
  restoreButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  restoreDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginLeft: 8,
    lineHeight: 20,
  },
});
