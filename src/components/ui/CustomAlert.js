import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

/**
 * Modern Custom Alert Component
 * 
 * Kullanım:
 * import { showAlert } from '../../components/ui/CustomAlert';
 * 
 * // Basit alert
 * showAlert('Başarılı!', 'İşlem tamamlandı.');
 * 
 * // Başarı alert'i
 * showAlert('Başarılı!', 'Doğum günü eklendi.', 'success');
 * 
 * // Hata alert'i
 * showAlert('Hata', 'Bir sorun oluştu.', 'error');
 * 
 * // Uyarı alert'i
 * showAlert('Uyarı', 'Devam etmek istediğinizden emin misiniz?', 'warning');
 * 
 * // Onay dialog'u (2 buton)
 * showAlert(
 *   'Sil',
 *   'Bu öğeyi silmek istediğinizden emin misiniz?',
 *   'warning',
 *   [
 *     { text: 'İptal', style: 'cancel' },
 *     { text: 'Sil', style: 'destructive', onPress: () => console.log('Silindi') }
 *   ]
 * );
 */

// Alert Tipleri ve Renkleri
const ALERT_TYPES = {
  success: {
    icon: 'checkmark-circle',
    gradient: ['#00b894', '#00cec9'],
    color: '#00b894',
  },
  error: {
    icon: 'close-circle',
    gradient: ['#d63031', '#ff7675'],
    color: '#d63031',
  },
  warning: {
    icon: 'warning',
    gradient: ['#fdcb6e', '#ffeaa7'],
    color: '#e17055',
  },
  info: {
    icon: 'information-circle',
    gradient: ['#74b9ff', '#a29bfe'],
    color: '#0984e3',
  },
  default: {
    icon: 'alert-circle-outline',
    gradient: ['#dfe6e9', '#b2bec3'],
    color: '#636e72',
  },
};

class CustomAlertManager {
  static alertRef = null;

  static setAlertRef(ref) {
    this.alertRef = ref;
  }

  static show(title, message, type = 'default', buttons = null) {
    if (this.alertRef) {
      this.alertRef.show(title, message, type, buttons);
    }
  }
}

export default class CustomAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      message: '',
      type: 'default',
      buttons: null,
    };
    this.scaleAnim = new Animated.Value(0.9);
    this.opacityAnim = new Animated.Value(0);
  }

  componentDidMount() {
    CustomAlertManager.setAlertRef(this);
  }

  show = (title, message, type = 'default', buttons = null) => {
    this.setState(
      {
        visible: true,
        title,
        message,
        type,
        buttons,
      },
      () => {
        // Animasyonu başlat
        Animated.parallel([
          Animated.spring(this.scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(this.opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );
  };

  hide = (callback) => {
    // Çıkış animasyonu
    Animated.parallel([
      Animated.timing(this.scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(this.opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ visible: false }, () => {
        // setState tamamlandıktan ve modal tamamen kapandıktan sonra
        // callback fonksiyonunu bir sonraki frame'de güvenle çalıştır.
        if (callback) {
          requestAnimationFrame(callback);
        }
      });
    });
  };

  handleButtonPress = (onPress, style) => {
    // 'cancel' butonu için sadece modalı kapat.
    if (style === 'cancel') {
      this.hide();
      return;
    }
    
    // Diğer tüm butonlar için, modal kapandıktan SONRA
    // `onPress` fonksiyonunu callback olarak çalıştır.
    this.hide(() => {
      if (onPress) {
        onPress();
      }
    });
  };

  renderButtons = () => {
    const { buttons, type } = this.state;

    // Buton yoksa varsayılan "Tamam" butonu
    if (!buttons) {
      return (
        <TouchableOpacity
          style={styles.singleButton}
          onPress={() => this.hide()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={ALERT_TYPES[type]?.gradient || ALERT_TYPES.default.gradient}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Tamam</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    // Tek buton
    if (buttons.length === 1) {
      const button = buttons[0];
      return (
        <TouchableOpacity
          style={styles.singleButton}
          onPress={() => this.handleButtonPress(button.onPress, button.style)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={ALERT_TYPES[type]?.gradient || ALERT_TYPES.default.gradient}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>{button.text}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    // İki buton (yan yana)
    return (
      <View style={styles.buttonRow}>
        {buttons.map((button, index) => {
          const isDestructive = button.style === 'destructive';
          const isCancel = button.style === 'cancel';

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.halfButton,
                index === 0 && styles.leftButton,
              ]}
              onPress={() => this.handleButtonPress(button.onPress, button.style)}
              activeOpacity={0.8}
            >
              {isCancel ? (
                <View style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>{button.text}</Text>
                </View>
              ) : (
                <LinearGradient
                  colors={
                    isDestructive
                      ? ['#d63031', '#ff7675']
                      : ALERT_TYPES[type]?.gradient || ALERT_TYPES.default.gradient
                  }
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>{button.text}</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  render() {
    const { visible, title, message, type } = this.state;
    const alertConfig = ALERT_TYPES[type] || ALERT_TYPES.default;

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={() => this.hide()}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          {/* Background blur effect */}
          <View style={styles.blurOverlay} />
          
          <Animated.View
            style={[
              styles.alertContainer,
              {
                opacity: this.opacityAnim,
                transform: [{ scale: this.scaleAnim }],
              },
            ]}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={alertConfig.gradient}
                style={styles.iconGradient}
              >
                <Ionicons
                  name={alertConfig.icon}
                  size={48}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              {message && <Text style={styles.message}>{message}</Text>}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {this.renderButtons()}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading2,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontSize: 22,
  },
  message: {
    ...FONT_STYLES.bodyMedium,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  singleButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  leftButton: {
    marginRight: 0,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#FFFFFF',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 16,
  },
  cancelButtonText: {
    ...FONT_STYLES.emphasisMedium,
    color: '#666',
    fontSize: 16,
  },
});

// Export helper function
export const showAlert = (title, message, type = 'default', buttons = null) => {
  CustomAlertManager.show(title, message, type, buttons);
};
