import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingPermissionsScreen({ navigation }) {
  const handleGetStarted = async () => {
    // Onboarding tamamlandı, bir daha gösterme
    await AsyncStorage.setItem('alreadyLaunched', 'true');
    navigation.navigate('Main');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const permissions = [
    {
      icon: '🔔',
      title: 'Bildirimler',
      description: 'Hatırlatıcılarınızı zamanında alabilmeniz için bildirim izni gerekli'
    },
    {
      icon: '📱',
      title: 'Uygulama Erişimi',
      description: 'Verilerinizi güvenli şekilde saklayabilmek için depolama erişimi'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>İzinler</Text>
          <Text style={styles.subtitle}>
            En iyi deneyim için bazı izinlere ihtiyacımız var
          </Text>

          <View style={styles.permissionsContainer}>
            {permissions.map((permission, index) => (
              <View key={index} style={styles.permissionCard}>
                <Text style={styles.permissionIcon}>{permission.icon}</Text>
                <View style={styles.permissionContent}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  <Text style={styles.permissionDescription}>{permission.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              💡 Bu izinleri daha sonra ayarlardan değiştirebilirsiniz
            </Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
          
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Başlayalım!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 24,
    color: '#007AFF',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  permissionsContainer: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  permissionIcon: {
    fontSize: 40,
    marginRight: 20,
    marginTop: 5,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noteContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  noteText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
  },
  bottomContainer: {
    paddingBottom: 50,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  getStartedButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
