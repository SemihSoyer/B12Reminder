import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// iPhone modelleri için responsive değerler
export const deviceSizes = {
  // iPhone SE, 8, 7, 6s, 6
  small: screenWidth <= 375,
  // iPhone 12 mini, 13 mini
  medium: screenWidth > 375 && screenWidth <= 390,
  // iPhone 12, 13, 14, 15
  large: screenWidth > 390 && screenWidth <= 428,
  // iPhone 12 Pro Max, 13 Pro Max, 14 Plus, 15 Plus
  extraLarge: screenWidth > 428,
};

// Responsive font boyutları
export const fontSizes = {
  small: deviceSizes.small ? 12 : 14,
  medium: deviceSizes.small ? 14 : 16,
  large: deviceSizes.small ? 16 : 18,
  extraLarge: deviceSizes.small ? 18 : 20,
  title: deviceSizes.small ? 20 : 24,
  header: deviceSizes.small ? 24 : 28,
};

// Responsive spacing
export const spacing = {
  xs: deviceSizes.small ? 4 : 6,
  sm: deviceSizes.small ? 8 : 10,
  md: deviceSizes.small ? 12 : 16,
  lg: deviceSizes.small ? 16 : 20,
  xl: deviceSizes.small ? 20 : 24,
  xxl: deviceSizes.small ? 24 : 32,
};

// Responsive card boyutları
export const cardSizes = {
  reminderCard: {
    width: deviceSizes.small ? '48%' : '48%',
    minHeight: deviceSizes.small ? 140 : 160,
  },
};

export const getResponsiveValue = (smallValue, mediumValue, largeValue) => {
  if (deviceSizes.small) return smallValue;
  if (deviceSizes.medium) return mediumValue || smallValue;
  return largeValue || mediumValue || smallValue;
};

export { screenWidth, screenHeight };
