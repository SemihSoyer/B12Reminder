import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function SettingItem({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showArrow = true,
  type = 'default', // 'default', 'switch', 'action'
  isEnabled = true,
}) {
  const renderRightContent = () => {
    if (type === 'switch') {
      return (
        <View style={[styles.switch, isEnabled && styles.switchEnabled]}>
          <View style={[styles.switchThumb, isEnabled && styles.switchThumbEnabled]} />
        </View>
      );
    }
    
    if (type === 'action') {
      return (
        <Text style={styles.actionText}>{value}</Text>
      );
    }
    
    if (showArrow) {
      return <Ionicons name="chevron-forward" size={20} color="#636e72" />;
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={[styles.container, !isEnabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!isEnabled}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={isEnabled ? "#74B9FF" : "#b2bec3"} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, !isEnabled && styles.disabledText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, !isEnabled && styles.disabledText]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContent}>
        {renderRightContent()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(116, 185, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...FONT_STYLES.emphasisMedium,
    color: '#2d3436',
    marginBottom: 2,
  },
  subtitle: {
    ...FONT_STYLES.bodySmall,
    color: '#636e72',
    fontSize: 12,
  },
  disabledText: {
    color: '#b2bec3',
  },
  rightContent: {
    marginLeft: spacing.sm,
  },
  actionText: {
    ...FONT_STYLES.bodyMedium,
    color: '#74B9FF',
    fontSize: 14,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#dfe6e9',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchEnabled: {
    backgroundColor: '#74B9FF',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  switchThumbEnabled: {
    alignSelf: 'flex-end',
  },
});
