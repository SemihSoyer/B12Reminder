import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeatureCard from '../../components/common/FeatureCard';

export default function DashboardScreen({ navigation }) {
  const featureCards = [
    {
      id: 'birthday',
      icon: '📚',
      title: 'Doğum Günü',
      value: '12',
      gradientColors: ['#FF9A8B', '#FF6A88', '#FF99AC'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#8B4513',
      screen: 'BirthdayReminder'
    },
    {
      id: 'medication',
      icon: '💊',
      title: 'İlaçlar',
      value: '5',
      gradientColors: ['#A8EDEA', '#74B9FF', '#0984E3'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#2D3436',
      screen: 'MedicationReminder'
    },
    {
      id: 'custom',
      icon: '⚡',
      title: 'Özel',
      value: '8',
      gradientColors: ['#D63031', '#E84393', '#A29BFE'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#2D3436',
      screen: 'CustomReminders'
    },
    {
      id: 'menstrual',
      icon: '📅',
      title: 'Regl Takibi',
      value: '28',
      gradientColors: ['#00B894', '#00CEC9', '#81ECEC'],
      iconBackgroundColor: 'rgba(255, 255, 255, 0.25)',
      iconColor: '#2D3436',
      screen: 'MenstrualTracking'
    }
  ];

  const handleCardPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={styles.greeting}>
                <Text style={styles.helloText}>Hello, Sandra</Text>
                <Text style={styles.dateText}>Today 25 Nov</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardsSection}>
            <View style={styles.cardsGrid}>
              {featureCards.map((card) => (
                <FeatureCard
                  key={card.id}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  gradientColors={card.gradientColors}
                  iconBackgroundColor={card.iconBackgroundColor}
                  iconColor={card.iconColor}
                  onPress={() => handleCardPress(card.screen)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 100, // Custom tab bar için alan bırak
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E5E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
  },
  greeting: {
    flex: 1,
  },
  helloText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  cardsSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});