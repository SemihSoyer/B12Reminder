/**
 * Font Constants
 * Merkezi font yönetim sistemi
 */

// Font yükleme için gerekli importlar
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';

// Font aileleri
export const FONT_FAMILIES = {
  // Poppins font aileleri
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
};

// Font boyutları (responsive.js'deki değerleri kullanacağız)
export const FONT_SIZES = {
  xs: 10,
  small: 12,
  medium: 14,
  large: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 32,
};

// Font stilleri - kolay kullanım için hazır kombinasyonlar
export const FONT_STYLES = {
  // Başlıklar
  heading1: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxxl,
  },
  heading2: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: FONT_SIZES.xl,
  },
  heading3: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: FONT_SIZES.large,
  },
  
  // Gövde metinleri
  bodyLarge: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.large,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.medium,
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.small,
  },
  
  // Vurgu metinleri
  emphasisLarge: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.large,
  },
  emphasisMedium: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.medium,
  },
  emphasisSmall: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.small,
  },
  
  // Özel durumlar
  cardTitle: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: FONT_SIZES.large,
  },
  buttonText: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: FONT_SIZES.medium,
  },
  caption: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.small,
  },
};

// Font yükleme durumu için hook
export const REQUIRED_FONTS = {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
};
