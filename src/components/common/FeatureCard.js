import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FeatureCard({ 
  icon, 
  title, 
  value, 
  gradientColors,
  onPress,
  iconColor = '#FFFFFF',
  iconBackgroundColor = 'rgba(255, 255, 255, 0.2)'
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
        <View style={styles.topRow}>
          <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
            <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.bottomRow}>
          <Text style={styles.value}>{value}</Text>
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
    height: 120,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  bottomRow: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 40,
  },
});
