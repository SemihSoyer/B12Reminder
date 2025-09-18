import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

export default function ProfileScreen({ navigation }) {
  const handleOnboardingPress = () => {
    navigation.navigate('Onboarding');
  };

  const handleHelpPress = () => {
    navigation.navigate('Help');
  };

  const handlePremiumPress = () => {
    navigation.navigate('Paywall');
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => console.log('Çıkış yapıldı') }
      ]
    );
  };

  const profileSections = [
    {
      title: 'Hesap',
      items: [
        {
          icon: '👤',
          title: 'Profil Bilgileri',
          subtitle: 'Kişisel bilgilerinizi düzenleyin',
          onPress: () => console.log('Profil bilgileri')
        },
        {
          icon: '🔔',
          title: 'Bildirim Ayarları',
          subtitle: 'Hatırlatıcı bildirimlerini özelleştirin',
          onPress: () => console.log('Bildirim ayarları')
        },
        {
          icon: '🔒',
          title: 'Gizlilik ve Güvenlik',
          subtitle: 'Gizlilik tercihlerinizi yönetin',
          onPress: () => console.log('Gizlilik ayarları')
        }
      ]
    },
    {
      title: 'Uygulama',
      items: [
        {
          icon: '✨',
          title: 'Premium\'a Yükselt',
          subtitle: 'Tüm özelliklerin kilidini açın',
          onPress: handlePremiumPress,
          isPremium: true
        },
        {
          icon: '🎨',
          title: 'Tema Ayarları',
          subtitle: 'Açık/koyu tema seçimi',
          onPress: () => console.log('Tema ayarları')
        },
        {
          icon: '🌐',
          title: 'Dil Ayarları',
          subtitle: 'Uygulama dilini değiştirin',
          onPress: () => console.log('Dil ayarları')
        }
      ]
    },
    {
      title: 'Destek',
      items: [
        {
          icon: '📚',
          title: 'Nasıl Başlarım?',
          subtitle: 'Onboarding rehberini tekrar görün',
          onPress: handleOnboardingPress
        },
        {
          icon: '❓',
          title: 'Yardım ve SSS',
          subtitle: 'Sık sorulan sorular ve destek',
          onPress: handleHelpPress
        },
        {
          icon: '📧',
          title: 'İletişim',
          subtitle: 'Bizimle iletişime geçin',
          onPress: () => console.log('İletişim')
        },
        {
          icon: '⭐',
          title: 'Uygulamayı Değerlendir',
          subtitle: 'App Store/Play Store\'da değerlendirin',
          onPress: () => console.log('Değerlendirme')
        }
      ]
    },
    {
      title: 'Veri Yönetimi',
      items: [
        {
          icon: '📤',
          title: 'Verileri Dışa Aktar',
          subtitle: 'Hatırlatıcı verilerinizi yedekleyin',
          onPress: () => console.log('Veri dışa aktarma')
        },
        {
          icon: '📥',
          title: 'Verileri İçe Aktar',
          subtitle: 'Yedek verilerinizi geri yükleyin',
          onPress: () => console.log('Veri içe aktarma')
        },
        {
          icon: '🗑️',
          title: 'Tüm Verileri Sil',
          subtitle: 'Tüm hatırlatıcıları kalıcı olarak silin',
          onPress: () => Alert.alert('Uyarı', 'Bu özellik yakında eklenecek'),
          isDestructive: true
        }
      ]
    }
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.menuItem,
        item.isPremium && styles.premiumItem,
        item.isDestructive && styles.destructiveItem
      ]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuItemIcon}>{item.icon}</Text>
        <View style={styles.menuItemContent}>
          <Text style={[
            styles.menuItemTitle,
            item.isPremium && styles.premiumText,
            item.isDestructive && styles.destructiveText
          ]}>
            {item.title}
          </Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.menuItemArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <Text style={styles.userName}>Kullanıcı</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => renderMenuItem(item, itemIndex))}
            </View>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>B12 Reminder v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2024 B12 Team</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    marginBottom: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 40,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    marginLeft: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  premiumItem: {
    backgroundColor: '#fff9e6',
  },
  destructiveItem: {
    backgroundColor: '#fff5f5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  premiumText: {
    color: '#ff9500',
  },
  destructiveText: {
    color: '#ff3b30',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#ccc',
    marginLeft: 10,
  },
  logoutSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff3b30',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#ccc',
  },
});
