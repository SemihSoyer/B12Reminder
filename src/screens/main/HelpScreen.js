import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function HelpScreen({ navigation }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = [
    {
      id: 1,
      question: 'Hatırlatıcıları nasıl kurarım?',
      answer: 'Ana sayfadan istediğiniz hatırlatıcı türünü seçin ve gerekli bilgileri girin. Uygulama size uygun zamanlarda bildirim gönderecektir.'
    },
    {
      id: 2,
      question: 'Bildirimler gelmiyor, ne yapmalıyım?',
      answer: 'Cihazınızın ayarlarından B12 Reminder uygulaması için bildirim izinlerini kontrol edin. Ayrıca uygulamanın arka planda çalışmasına izin verildiğinden emin olun.'
    },
    {
      id: 3,
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz cihazınızda yerel olarak saklanır. Kişisel bilgileriniz hiçbir zaman sunucularımıza gönderilmez.'
    },
    {
      id: 4,
      question: 'Premium özellikleri nelerdir?',
      answer: 'Premium ile sınırsız hatırlatıcı kurabilir, gelişmiş özelleştirme seçeneklerini kullanabilir ve reklamsız deneyimin keyfini çıkarabilirsiniz.'
    },
    {
      id: 5,
      question: 'Regl takibi nasıl çalışır?',
      answer: 'Regl başlangıç tarihlerinizi girerek döngünüzü takip edebilir, gelecek dönemler için tahmin alabilir ve sağlık notlarınızı kaydedebilirsiniz.'
    },
    {
      id: 6,
      question: 'İlaç hatırlatıcısında dozaj ayarı yapabilir miyim?',
      answer: 'Evet, her ilaç için dozaj miktarını, alım saatlerini ve sıklığını özelleştirebilirsiniz. Uygulama size tam zamanında hatırlatır.'
    }
  ];

  const helpSections = [
    {
      title: 'Başlangıç Rehberi',
      icon: '📚',
      description: 'Uygulamayı kullanmaya başlamak için adım adım rehber'
    },
    {
      title: 'Video Eğitimleri',
      icon: '🎥',
      description: 'Görsel eğitimlerle özellikleri öğrenin'
    },
    {
      title: 'İletişim',
      icon: '📧',
      description: 'Sorularınız için bizimle iletişime geçin'
    },
    {
      title: 'Geri Bildirim',
      icon: '💭',
      description: 'Önerilerinizi ve görüşlerinizi paylaşın'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Yardım ve Destek</Text>
          <Text style={styles.headerSubtitle}>
            Size yardımcı olmak için buradayız
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Yardım</Text>
          <View style={styles.helpGrid}>
            {helpSections.map((section, index) => (
              <TouchableOpacity key={index} style={styles.helpCard}>
                <Text style={styles.helpIcon}>{section.icon}</Text>
                <Text style={styles.helpTitle}>{section.title}</Text>
                <Text style={styles.helpDescription}>{section.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sık Sorulan Sorular</Text>
          {faqData.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleExpanded(item.id)}
              >
                <Text style={styles.faqQuestionText}>{item.question}</Text>
                <Text style={styles.faqArrow}>
                  {expandedItems[item.id] ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              {expandedItems[item.id] && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Bilgileri</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versiyon:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Son Güncelleme:</Text>
              <Text style={styles.infoValue}>Ocak 2024</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Geliştirici:</Text>
              <Text style={styles.infoValue}>B12 Team</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Hala yardıma mı ihtiyacınız var?</Text>
          <Text style={styles.contactSubtitle}>
            Sorularınız için bizimle iletişime geçebilirsiniz
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>İletişime Geç</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  helpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  helpCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  helpDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 5,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  faqArrow: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  faqAnswer: {
    paddingBottom: 15,
    paddingRight: 30,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  contactSection: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#B3D9FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  contactButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
