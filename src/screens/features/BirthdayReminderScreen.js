import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';

export default function BirthdayReminderScreen({ navigation }) {
  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      date: '15 Ocak',
      daysLeft: 5,
      year: 1990
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      date: '22 Şubat',
      daysLeft: 38,
      year: 1985
    }
  ]);

  const [searchText, setSearchText] = useState('');

  const handleAddBirthday = () => {
    Alert.alert('Yeni Doğum Günü', 'Doğum günü ekleme özelliği yakında eklenecek');
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
          onPress: () => setBirthdays(birthdays.filter(b => b.id !== id))
        }
      ]
    );
  };

  const filteredBirthdays = birthdays.filter(birthday =>
    birthday.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const upcomingBirthdays = filteredBirthdays.filter(b => b.daysLeft <= 30);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Doğum Günü Hatırlatıcısı</Text>
          <Text style={styles.headerSubtitle}>
            Sevdiklerinizin doğum günlerini asla kaçırmayın
          </Text>
        </View>

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
                <View style={styles.birthdayInfo}>
                  <Text style={styles.birthdayName}>{birthday.name}</Text>
                  <Text style={styles.birthdayDate}>{birthday.date}</Text>
                  <Text style={styles.birthdayAge}>
                    {new Date().getFullYear() - birthday.year} yaşına girecek
                  </Text>
                </View>
                <View style={styles.birthdayActions}>
                  <View style={styles.daysLeftBadge}>
                    <Text style={styles.daysLeftText}>{birthday.daysLeft} gün</Text>
                  </View>
                  <View style={styles.actionButtons}>
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
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tüm Doğum Günleri</Text>
          {filteredBirthdays.length > 0 ? (
            filteredBirthdays.map((birthday) => (
              <View key={birthday.id} style={styles.birthdayCard}>
                <View style={styles.birthdayInfo}>
                  <Text style={styles.birthdayName}>{birthday.name}</Text>
                  <Text style={styles.birthdayDate}>{birthday.date}</Text>
                  <Text style={styles.birthdayAge}>
                    {birthday.year} doğumlu
                  </Text>
                </View>
                <View style={styles.birthdayActions}>
                  <Text style={styles.daysLeftText}>
                    {birthday.daysLeft > 30 ? `${birthday.daysLeft} gün` : 'Yaklaşıyor'}
                  </Text>
                  <View style={styles.actionButtons}>
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
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎂</Text>
              <Text style={styles.emptyStateTitle}>Henüz doğum günü yok</Text>
              <Text style={styles.emptyStateDescription}>
                İlk doğum gününüzü ekleyerek başlayın
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
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddBirthday}>
        <Text style={styles.addButtonText}>+ Doğum Günü Ekle</Text>
      </TouchableOpacity>
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
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
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
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  upcomingCard: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  birthdayInfo: {
    flex: 1,
  },
  birthdayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  birthdayDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  birthdayAge: {
    fontSize: 12,
    color: '#999',
  },
  birthdayActions: {
    alignItems: 'flex-end',
  },
  daysLeftBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  daysLeftText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 16,
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
