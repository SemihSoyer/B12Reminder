import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import CustomHeader from '../../components/common/CustomHeader';
import { fontSizes, spacing } from '../../constants/responsive';
import { BirthdayService } from '../../utils/storage';
import '../../utils/debugStorage'; // Debug fonksiyonları

export default function BirthdayReminderScreen({ navigation }) {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Sayfa odaklandığında verileri yükle
  useFocusEffect(
    React.useCallback(() => {
      loadBirthdays();
    }, [])
  );

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      const data = await BirthdayService.getBirthdays();
      
      // Veriyi görüntüleme formatına çevir
      const formattedData = data.map(birthday => {
        console.log('Processing birthday:', birthday);
        console.log('Birthday name:', birthday.name);
        console.log('Birthday name type:', typeof birthday.name);
        console.log('Birthday name length:', birthday.name ? birthday.name.length : 'undefined/null');
        
        if (!birthday.birthDate) {
          console.error('Birthday missing birthDate:', birthday);
          return {
            ...birthday,
            date: 'Tarih belirtilmemiş',
            daysLeft: 999,
            year: 2000
          };
        }
        
        const [year, month, day] = birthday.birthDate.split('-');
        console.log('Date parts:', { year, month, day });
        
        if (!year || !month || !day) {
          console.error('Invalid date format:', birthday.birthDate);
          return {
            ...birthday,
            date: 'Geçersiz tarih',
            daysLeft: 999,
            year: 2000
          };
        }
        
        const months = [
          'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        // Yaklaşan doğum gününü hesapla
        const today = new Date();
        const thisYear = today.getFullYear();
        const monthIndex = parseInt(month) - 1;
        const dayNum = parseInt(day);
        
        if (monthIndex < 0 || monthIndex > 11 || dayNum < 1 || dayNum > 31) {
          console.error('Invalid month or day:', { month: monthIndex, day: dayNum });
          return {
            ...birthday,
            date: 'Geçersiz tarih',
            daysLeft: 999,
            year: 2000
          };
        }
        
        let nextBirthday = new Date(thisYear, monthIndex, dayNum);
        
        if (nextBirthday < today) {
          nextBirthday = new Date(thisYear + 1, monthIndex, dayNum);
        }
        
        const daysLeft = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        
        const formattedDate = `${dayNum} ${months[monthIndex]}`;
        console.log('Formatted date:', formattedDate);
        
        return {
          ...birthday,
          date: formattedDate,
          daysLeft,
          year: parseInt(year)
        };
      });
      
      setBirthdays(formattedData);
    } catch (error) {
      console.error('Error loading birthdays:', error);
      Alert.alert('Hata', 'Doğum günleri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBirthday = () => {
    navigation.navigate('AddBirthday');
  };

  const handleEditBirthday = (id) => {
    Alert.alert('Düzenle', `Doğum günü düzenleme özelliği yakında eklenecek (ID: ${id})`);
  };

  const handleDeleteBirthday = (id) => {
    Alert.alert(
      'Sil',
      'Bu doğum gününü silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await BirthdayService.deleteBirthday(id);
              if (result.success) {
                loadBirthdays(); // Listeyi yenile
                Alert.alert('Başarılı', 'Doğum günü silindi');
              } else {
                Alert.alert('Hata', result.error || 'Silme işlemi başarısız');
              }
            } catch (error) {
              Alert.alert('Hata', 'Bir hata oluştu');
              console.error('Delete error:', error);
            }
          }
        }
      ]
    );
  };

  const filteredBirthdays = birthdays.filter(birthday =>
    birthday.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const upcomingBirthdays = filteredBirthdays.filter(b => b.daysLeft <= 30);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <CustomHeader 
        title="Doğum Günü Hatırlatıcısı"
        onBackPress={() => navigation.goBack()}
        backgroundColor="#f8f9fa"
      />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="İsim ara..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {upcomingBirthdays.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yaklaşan Doğum Günleri (30 gün)</Text>
            {upcomingBirthdays.map((birthday) => (
              <View key={birthday.id} style={[styles.birthdayCard, styles.upcomingCard]}>
                {/* Fotoğraf */}
                <View style={styles.photoContainer}>
                  {birthday.photo ? (
                    <Image 
                      source={{ uri: birthday.photo }} 
                      style={styles.birthdayPhoto}
                    />
                  ) : (
                    <View style={styles.placeholderPhoto}>
                      <Text style={styles.placeholderIcon}>👤</Text>
                    </View>
                  )}
                </View>

                {/* Bilgiler */}
                <View style={styles.birthdayInfo}>
                  <Text style={styles.birthdayName}>{birthday.name || 'İsimsiz'}</Text>
                  <Text style={styles.birthdayDate}>{birthday.date}</Text>
                  
                  {/* Özel Not */}
                  {birthday.customNote && (
                    <Text style={styles.birthdayNote}>"{birthday.customNote}"</Text>
                  )}
                  
                  {/* Yaklaşan Badge */}
                  <View style={styles.daysLeftBadge}>
                    <Text style={styles.daysLeftBadgeText}>
                      {birthday.daysLeft === 0 
                        ? '🎉 Bugün!' 
                        : birthday.daysLeft === 1 
                        ? '🎂 Yarın!' 
                        : `⏰ ${birthday.daysLeft} gün kaldı`
                      }
                    </Text>
                  </View>
                </View>

                {/* Aksiyon Butonları */}
                <View style={styles.birthdayActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditBirthday(birthday.id)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteBirthday(birthday.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tüm Doğum Günleri</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Doğum günleri yükleniyor...</Text>
            </View>
          ) : filteredBirthdays.length > 0 ? (
            filteredBirthdays.map((birthday) => (
              <View key={birthday.id} style={styles.birthdayCard}>
                {/* Fotoğraf */}
                <View style={styles.photoContainer}>
                  {birthday.photo ? (
                    <Image 
                      source={{ uri: birthday.photo }} 
                      style={styles.birthdayPhoto}
                    />
                  ) : (
                    <View style={styles.placeholderPhoto}>
                      <Text style={styles.placeholderIcon}>👤</Text>
                    </View>
                  )}
                </View>

                {/* Bilgiler */}
                <View style={styles.birthdayInfo}>
                  <Text style={styles.birthdayName}>{birthday.name || 'İsimsiz'}</Text>
                  <Text style={styles.birthdayDate}>{birthday.date}</Text>
                  
                  {/* Özel Not */}
                  {birthday.customNote && (
                    <Text style={styles.birthdayNote}>"{birthday.customNote}"</Text>
                  )}
                  
                  {/* Gün Sayısı */}
                  <View style={styles.daysLeftContainer}>
                    <Text style={[
                      styles.daysLeftText,
                      birthday.daysLeft <= 7 && styles.urgentDaysLeft
                    ]}>
                      {birthday.daysLeft === 0 
                        ? '🎉 Bugün!' 
                        : birthday.daysLeft === 1 
                        ? '🎂 Yarın!' 
                        : birthday.daysLeft <= 7 
                        ? `⏰ ${birthday.daysLeft} gün kaldı`
                        : `📅 ${birthday.daysLeft} gün`
                      }
                    </Text>
                  </View>
                </View>

                {/* Aksiyon Butonları */}
                <View style={styles.birthdayActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditBirthday(birthday.id)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteBirthday(birthday.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎂</Text>
              <Text style={styles.emptyStateTitle}>
                {searchText ? 'Arama sonucu bulunamadı' : 'Henüz doğum günü yok'}
              </Text>
              <Text style={styles.emptyStateDescription}>
                {searchText 
                  ? 'Farklı bir isim deneyin' 
                  : 'İlk doğum gününüzü ekleyerek başlayın'
                }
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{birthdays.length}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{upcomingBirthdays.length}</Text>
              <Text style={styles.statLabel}>Yaklaşan</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {birthdays.filter(b => b.daysLeft <= 7).length}
              </Text>
              <Text style={styles.statLabel}>Bu Hafta</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddBirthday}>
          <Text style={styles.addButtonText}>+ Doğum Günü Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </>
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
  searchSection: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 10,
    fontSize: fontSizes.medium,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  birthdayCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  upcomingCard: {
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  photoContainer: {
    marginRight: spacing.md,
    alignSelf: 'flex-start',
  },
  birthdayPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  placeholderPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 24,
    color: '#999',
  },
  birthdayInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  birthdayName: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: spacing.xs,
  },
  birthdayDate: {
    fontSize: fontSizes.small,
    color: '#666',
    marginBottom: spacing.xs,
  },
  birthdayNote: {
    fontSize: fontSizes.small,
    color: '#007AFF',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  daysLeftContainer: {
    marginTop: spacing.xs,
  },
  birthdayActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysLeftBadge: {
    backgroundColor: '#ff9500',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginTop: spacing.xs,
  },
  daysLeftBadgeText: {
    color: '#fff',
    fontSize: fontSizes.small,
    fontWeight: '600',
  },
  daysLeftText: {
    fontSize: fontSizes.small,
    color: '#666',
    fontWeight: '500',
  },
  urgentDaysLeft: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: fontSizes.medium,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
