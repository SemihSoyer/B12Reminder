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

export default function AddCustomReminderButton({ onPress, style, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <LinearGradient
        colors={disabled ? ['#CCC', '#AAA'] : ['#A29BFE', '#6C5CE7', '#A29BFE']}
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
        <Text style={styles.buttonText}>Hatırlatıcı Ekle</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: '#6C5CE7',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
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


