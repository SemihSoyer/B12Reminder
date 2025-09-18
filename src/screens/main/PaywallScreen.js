import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function PaywallScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const plans = [
    {
      id: 'monthly',
      title: 'Aylık',
      price: '29,99 ₺',
      period: 'ay',
      description: 'Aylık faturalandırma',
      popular: false
    },
    {
      id: 'yearly',
      title: 'Yıllık',
      price: '199,99 ₺',
      period: 'yıl',
      description: '12 ay boyunca sadece',
      popular: true,
      savings: '%44 tasarruf'
    }
  ];

  const features = [
    {
      icon: '🚫',
      title: 'Reklamsız Deneyim',
      description: 'Hiç reklam görmeden uygulamayı kullanın'
    },
    {
      icon: '∞',
      title: 'Sınırsız Hatırlatıcı',
      description: 'İstediğiniz kadar hatırlatıcı oluşturun'
    },
    {
      icon: '🎨',
      title: 'Özel Temalar',
      description: 'Uygulamanızı kişiselleştirin'
    },
    {
      icon: '📊',
      title: 'Detaylı İstatistikler',
      description: 'Hatırlatıcı geçmişinizi analiz edin'
    },
    {
      icon: '☁️',
      title: 'Bulut Yedekleme',
      description: 'Verilerinizi güvenle saklayın'
    },
    {
      icon: '🔔',
      title: 'Akıllı Bildirimler',
      description: 'Gelişmiş bildirim özelleştirmeleri'
    }
  ];

  const handlePurchase = () => {
    // Burada satın alma işlemi gerçekleşecek
    console.log(`Seçilen plan: ${selectedPlan}`);
    // Geçici olarak geri dön
    navigation.goBack();
  };

  const handleRestore = () => {
    // Satın alma geri yükleme işlemi
    console.log('Satın alma geri yükleniyor...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>✨</Text>
            <Text style={styles.headerTitle}>Premium'a Yükseltin</Text>
            <Text style={styles.headerSubtitle}>
              Tüm özelliklerin kilidini açın ve en iyi deneyimi yaşayın
            </Text>
          </View>
        </View>

        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Plan Seçin</Text>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.popular && styles.planCardPopular
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>En Popüler</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                  {plan.savings && (
                    <Text style={styles.planSavings}>{plan.savings}</Text>
                  )}
                </View>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>/{plan.period}</Text>
                </View>
              </View>
              
              <View style={styles.radioButton}>
                <View style={[
                  styles.radioOuter,
                  selectedPlan === plan.id && styles.radioSelected
                ]}>
                  {selectedPlan === plan.id && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Özellikler</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>🔒 Güvenli Ödeme</Text>
          <Text style={styles.trustDescription}>
            Ödemeleriniz Apple/Google tarafından güvence altına alınmıştır. 
            İstediğiniz zaman iptal edebilirsiniz.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.purchaseButtonText}>
            {selectedPlan === 'yearly' ? '199,99 ₺/yıl' : '29,99 ₺/ay'} ile Başla
          </Text>
        </TouchableOpacity>
        
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={styles.linkText}>Satın Alımı Geri Yükle</Text>
          </TouchableOpacity>
          <Text style={styles.linkSeparator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Kullanım Koşulları</Text>
          </TouchableOpacity>
          <Text style={styles.linkSeparator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Gizlilik</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 15,
    marginRight: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  plansSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  planCardPopular: {
    borderColor: '#28a745',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  planSavings: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
  },
  planPricing: {
    alignItems: 'flex-end',
    marginRight: 15,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  featuresSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 30,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  trustSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  trustDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSection: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: '#666',
  },
  linkSeparator: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
});
