import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

export default function MenstrualTrackingScreen({ navigation }) {
  const [currentPhase, setCurrentPhase] = useState('follicular'); // follicular, ovulation, luteal, menstrual
  const [cycleDay, setCycleDay] = useState(12);
  const [nextPeriod, setNextPeriod] = useState('8 gün sonra');

  const phases = {
    menstrual: { name: 'Adet Dönemi', color: '#ff6b6b', icon: '🩸' },
    follicular: { name: 'Foliküler Faz', color: '#4ecdc4', icon: '🌱' },
    ovulation: { name: 'Yumurtlama', color: '#ffe66d', icon: '🥚' },
    luteal: { name: 'Luteal Faz', color: '#ff8e53', icon: '🌙' }
  };

  const mockData = {
    lastPeriod: '2024-01-10',
    cycleLength: 28,
    periodLength: 5,
    symptoms: ['Kramp', 'Baş ağrısı'],
    mood: 'İyi',
    flow: 'Orta'
  };

  const handleLogPeriod = () => {
    Alert.alert('Adet Kaydı', 'Adet dönemi kaydetme özelliği yakında eklenecek');
  };

  const handleLogSymptoms = () => {
    Alert.alert('Semptom Kaydı', 'Semptom kaydetme özelliği yakında eklenecek');
  };

  const handleViewHistory = () => {
    Alert.alert('Geçmiş', 'Geçmiş kayıtlar özelliği yakında eklenecek');
  };

  const handleSettings = () => {
    Alert.alert('Ayarlar', 'Döngü ayarları özelliği yakında eklenecek');
  };

  const quickActions = [
    {
      title: 'Adet Başladı',
      icon: '🩸',
      color: '#ff6b6b',
      onPress: handleLogPeriod
    },
    {
      title: 'Semptom Kaydet',
      icon: '📝',
      color: '#4ecdc4',
      onPress: handleLogSymptoms
    },
    {
      title: 'Ruh Hali',
      icon: '😊',
      color: '#ffe66d',
      onPress: () => Alert.alert('Ruh Hali', 'Ruh hali kaydetme yakında eklenecek')
    },
    {
      title: 'Not Ekle',
      icon: '📋',
      color: '#ff8e53',
      onPress: () => Alert.alert('Not', 'Not ekleme özelliği yakında eklenecek')
    }
  ];

  const insights = [
    {
      title: 'Döngü Düzenliliği',
      value: '92%',
      description: 'Son 3 ayda düzenli',
      color: '#4ecdc4'
    },
    {
      title: 'Ortalama Döngü',
      value: '28 gün',
      description: 'Normal aralık',
      color: '#007AFF'
    },
    {
      title: 'Adet Süresi',
      value: '5 gün',
      description: 'Ortalama süre',
      color: '#ff8e53'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Regl Takibi</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.currentStatusSection}>
          <View style={styles.statusCard}>
            <View style={styles.phaseIndicator}>
              <Text style={styles.phaseIcon}>{phases[currentPhase].icon}</Text>
              <View style={[styles.phaseDot, { backgroundColor: phases[currentPhase].color }]} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.currentPhase}>{phases[currentPhase].name}</Text>
              <Text style={styles.cycleInfo}>Döngü günü: {cycleDay}</Text>
              <Text style={styles.nextPeriodInfo}>Sonraki adet: {nextPeriod}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { borderLeftColor: action.color }]}
                onPress={action.onPress}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bu Ay</Text>
          <View style={styles.monthlyCard}>
            <View style={styles.monthlyHeader}>
              <Text style={styles.monthlyTitle}>Ocak 2024</Text>
              <TouchableOpacity onPress={handleViewHistory}>
                <Text style={styles.viewHistoryText}>Geçmişi Gör</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.monthlyStats}>
              <View style={styles.monthlyStat}>
                <Text style={styles.monthlyStatLabel}>Son Adet</Text>
                <Text style={styles.monthlyStatValue}>10 Ocak</Text>
              </View>
              <View style={styles.monthlyStat}>
                <Text style={styles.monthlyStatLabel}>Döngü Uzunluğu</Text>
                <Text style={styles.monthlyStatValue}>{mockData.cycleLength} gün</Text>
              </View>
              <View style={styles.monthlyStat}>
                <Text style={styles.monthlyStatLabel}>Adet Süresi</Text>
                <Text style={styles.monthlyStatValue}>{mockData.periodLength} gün</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sağlık İçgörüleri</Text>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={[styles.insightIndicator, { backgroundColor: insight.color }]} />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
              <Text style={[styles.insightValue, { color: insight.color }]}>
                {insight.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Kayıtlar</Text>
          <View style={styles.recentCard}>
            <View style={styles.recentItem}>
              <Text style={styles.recentIcon}>😊</Text>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>Ruh Hali: {mockData.mood}</Text>
                <Text style={styles.recentDate}>Bugün</Text>
              </View>
            </View>
            <View style={styles.recentItem}>
              <Text style={styles.recentIcon}>📝</Text>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>Semptomlar: {mockData.symptoms.join(', ')}</Text>
                <Text style={styles.recentDate}>Dün</Text>
              </View>
            </View>
            <View style={styles.recentItem}>
              <Text style={styles.recentIcon}>💧</Text>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>Akış: {mockData.flow}</Text>
                <Text style={styles.recentDate}>2 gün önce</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tipSection}>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Günlük İpucu</Text>
              <Text style={styles.tipText}>
                Foliküler fazda enerji seviyeniz yüksektir. Bu dönemde yeni projeler başlamak için ideal zaman!
              </Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 5,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  currentStatusSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
  },
  phaseIndicator: {
    alignItems: 'center',
    marginRight: 20,
  },
  phaseIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusInfo: {
    flex: 1,
  },
  currentPhase: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cycleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  nextPeriodInfo: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  monthlyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  monthlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthlyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  viewHistoryText: {
    fontSize: 14,
    color: '#007AFF',
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  monthlyStat: {
    alignItems: 'center',
  },
  monthlyStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  monthlyStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  insightIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 15,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  recentIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 12,
    color: '#999',
  },
  tipSection: {
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});
