import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function MenuButton({
  icon,
  title,
  subtitle,
  gradientColors = ['#74B9FF', '#0984E3'],
  onPress,
  badge = null,
  isDisabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, isDisabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={isDisabled ? ['#dfe6e9', '#b2bec3'] : gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={icon} 
              size={28} 
              color={isDisabled ? '#636e72' : '#FFFFFF'} 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, isDisabled && styles.disabledText]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, isDisabled && styles.disabledText]}>
                {subtitle}
              </Text>
            )}
          </View>
          
          <View style={styles.rightContainer}>
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDisabled ? '#636e72' : 'rgba(255, 255, 255, 0.8)'} 
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    padding: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 2,
  },
  subtitle: {
    ...FONT_STYLES.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  disabledText: {
    color: '#636e72',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.sm,
  },
  badgeText: {
    ...FONT_STYLES.bodySmall,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
