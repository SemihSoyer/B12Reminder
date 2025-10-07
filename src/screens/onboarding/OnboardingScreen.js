import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    image: require('../../../assets/onboarding/onboarding1.png'),
    title: 'Welcome',
    description: 'Never miss important moments and tasks in your life. Remember everything from birthdays to medication times.',
    gradient: ['#C9F0FF', '#FFF4CC', '#E8F5E9'],
    titleColor: '#2E7D32',
    buttonColor: '#2E7D32',
    activeDotColor: '#43A047',
  },
  {
    id: '2',
    image: require('../../../assets/onboarding/onboarding2.png'),
    title: 'Powerful Features',
    description: 'Track birthdays, periods, medications, and create custom reminders. Everything you need in one app.',
    gradient: ['#FFE5E5', '#FFF9E5', '#E5F5FF'],
    titleColor: '#00796B',
    buttonColor: '#00897B',
    activeDotColor: '#26A69A',
  },
  {
    id: '3',
    image: require('../../../assets/onboarding/onboarding3.png'),
    title: 'Stay Notified',
    description: 'Enable notifications to receive timely reminders and never miss important moments.',
    gradient: ['#F3E5FF', '#FFE5F5', '#E5F9FF'],
    titleColor: '#6A1B9A',
    buttonColor: '#8E24AA',
    activeDotColor: '#AB47BC',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gradientColors, setGradientColors] = useState(onboardingData[0].gradient);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
    
    // Update gradient colors based on current page
    if (onboardingData[index]) {
      setGradientColors(onboardingData[index].gradient);
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    navigation.navigate('Main');
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('alreadyLaunched', 'true');
    navigation.navigate('Main');
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={item.image}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: item.titleColor }]}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {currentIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}
          
          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FlatList for swipeable pages */}
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          decelerationRate="fast"
        />

        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && [
                    styles.activeDot,
                    { backgroundColor: onboardingData[currentIndex].activeDotColor }
                  ],
                ]}
              />
            ))}
          </View>

          {/* Next/Get Started Button */}
          <TouchableOpacity 
            style={[
              styles.nextButton,
              { backgroundColor: onboardingData[currentIndex].buttonColor }
            ]} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#546E7A',
    fontWeight: '400',
  },
  headerSpacer: {
    width: 40,
  },
  skipButton: {
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#546E7A',
    fontWeight: '500',
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    flex: 1,
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  illustration: {
    width: '100%',
    height: '100%',
    maxHeight: height * 0.4,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#546E7A',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CFD8DC',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

