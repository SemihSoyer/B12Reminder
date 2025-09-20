import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function FeatureCard({ 
  icon, 
  title, 
  value, 
  backgroundColor, 
  onPress,
  iconColor = '#FFFFFF',
  iconBackgroundColor = 'rgba(0, 0, 0, 0.2)'
}) {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor }]} 
      onPress={onPress}
      activeOpacity={0.8}
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 120,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
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
