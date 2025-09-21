import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function AddBirthdayButton({ onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#FF9A8B', '#FF6A88', '#FF99AC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Ionicons 
          name="add-circle-outline" 
          size={24} 
          color="#FFFFFF" 
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Doğum Günü Ekle</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: '#FF6A88',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 25,
    minHeight: 56,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
  },
});
