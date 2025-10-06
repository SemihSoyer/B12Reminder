import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

export default function InfoModal({ visible, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const features = [
    {
      icon: 'calendar',
      color: '#FF6B9D',
      title: 'Cycle Tracking',
      description: 'Save your periods, predict the next date',
    },
    {
      icon: 'heart',
      color: '#00B894',
      title: 'Efficient Period',
      description: 'Efficient periods automatically calculated',
    },
    {
      icon: 'stats-chart',
      color: '#A29BFE',
      title: 'Statistics',
      description: 'View your cycle regularity and averages',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <LinearGradient
            colors={['#FF6B9D', '#FFA06B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerIcon}>
              <Ionicons name="heart-circle" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Cycle Tracking</Text>
            <Text style={styles.headerSubtitle}>
              Track your health, stay regular! 🌸
            </Text>
          </LinearGradient>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>What can you do on this page?</Text>
            
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <Ionicons name={feature.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}

            {/* Getting Started */}
            <View style={styles.stepsSection}>
              <View style={styles.stepsHeader}>
                <Ionicons name="rocket" size={18} color="#FF6B9D" />
                <Text style={styles.stepsTitle}>Quick Start</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  <Text style={styles.stepBold}>Start Period</Text> button to start
                </Text>
              </View>

              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Select your <Text style={styles.stepBold}>last period start date</Text>
                </Text>
              </View>

              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Enter your <Text style={styles.stepBold}>period length</Text> (how many days)
                </Text>
              </View>
            </View>

            {/* Privacy */}
            <View style={styles.privacyNote}>
              <Ionicons name="shield-checkmark" size={16} color="#00B894" />
              <Text style={styles.privacyText}>
                All your data is securely stored on your device
              </Text>
            </View>
          </ScrollView>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF6B9D', '#FFA06B']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>I understand, let's start!</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '88%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: spacing.sm,
  },
  headerTitle: {
    ...FONT_STYLES.heading2,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    fontSize: 24,
  },
  headerSubtitle: {
    ...FONT_STYLES.bodyMedium,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...FONT_STYLES.emphasisSmall,
    color: '#1a1a1a',
    marginBottom: 2,
    fontSize: 14,
  },
  featureDescription: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  stepsSection: {
    backgroundColor: 'rgba(255, 107, 157, 0.08)',
    borderRadius: 12,
    padding: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  stepsTitle: {
    ...FONT_STYLES.emphasisSmall,
    color: '#FF6B9D',
    fontSize: 14,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 1,
  },
  stepNumberText: {
    ...FONT_STYLES.emphasisSmall,
    color: '#FFFFFF',
    fontSize: 11,
  },
  stepText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  stepBold: {
    ...FONT_STYLES.emphasisSmall,
    color: '#1a1a1a',
    fontSize: 13,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
    borderRadius: 10,
    padding: spacing.sm,
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  privacyText: {
    ...FONT_STYLES.bodySmall,
    color: '#00B894',
    flex: 1,
    fontSize: 12,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  buttonText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    fontSize: 15,
  },
});
