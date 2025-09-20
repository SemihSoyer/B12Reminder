import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function FeatureCard({ 
  icon, 
  title, 
  gradientColors,
  onPress,
  iconColor = '#FFFFFF',
  iconBackgroundColor = 'rgba(255, 255, 255, 0.25)',
  iconType = 'ionicon' // 'ionicon' veya 'emoji'
}) {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
            {iconType === 'ionicon' ? (
              <Ionicons 
                name={icon} 
                size={24} 
                color={iconColor} 
              />
            ) : (
              <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    marginBottom: 16,
    // Enhanced shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    // Enhanced shadow for Android
    elevation: 12,
  },
  card: {
    width: '100%',
    height: 80,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
});
