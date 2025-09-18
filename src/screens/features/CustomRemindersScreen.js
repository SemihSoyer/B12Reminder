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

export default function CustomRemindersScreen({ navigation }) {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Su İçme Hatırlatıcısı',
      description: 'Her 2 saatte bir su içmeyi unutma',
      category: 'Sağlık',
      frequency: 'Her 2 saatte',
      nextReminder: '1 saat sonra',
      color: '#4ecdc4',
      isActive: true
    },
    {
      id: 2,
      title: 'Egzersiz Zamanı',
      description: 'Günlük 30 dakika yürüyüş',
      category: 'Spor',
      frequency: 'Günlük',
      nextReminder: '6 saat sonra',
      color: '#ff6b6b',
      isActive: true
    },
    {
      id: 3,
      title: 'Kitap Okuma',
      description: 'Günde 20 sayfa kitap okuma',
      category: 'Kişisel Gelişim',
      frequency: 'Günlük',
      nextReminder: 'Yarın',
      color: '#ffe66d',
      isActive: false
    },
    {
      id: 4,
      title: 'Ailem ile Konuş',
      description: 'Haftalık aile görüşmesi',
      category: 'Aile',
      frequency: 'Haftalık',
      nextReminder: '3 gün sonra',
      color: '#ff8e53',
      isActive: true
    }
  ]);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Tümü', count: reminders.length },
    { key: 'Sağlık', label: 'Sağlık', count: reminders.filter(r => r.category === 'Sağlık').length },
    { key: 'Spor', label: 'Spor', count: reminders.filter(r => r.category === 'Spor').length },
    { key: 'Kişisel Gelişim', label: 'Kişisel Gelişim', count: reminders.filter(r => r.category === 'Kişisel Gelişim').length },
    { key: 'Aile', label: 'Aile', count: reminders.filter(r => r.category === 'Aile').length },
  ];

  const handleAddReminder = () => {
    Alert.alert('Yeni Hatırlatıcı', 'Hatırlatıcı ekleme özelliği yakında eklenecek');
  };

  const handleToggleActive = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
    ));
  };

  const handleEditReminder = (id) => {
    Alert.alert('Düzenle', `Hatırlatıcı düzenleme özelliği yakında eklenecek (ID: ${id})`);
  };

  const handleDeleteReminder = (id) => {
    Alert.alert(
      'Sil',
      'Bu hatırlatıcıyı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => setReminders(reminders.filter(r => r.id !== id))
        }
      ]
    );
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         reminder.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reminder.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeReminders = reminders.filter(r => r.isActive);
  const inactiveReminders = reminders.filter(r => !r.isActive);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Özel Hatırlatıcılar</Text>
          <Text style={styles.headerSubtitle}>
            Kişiselleştirilmiş hatırlatıcılarınızı yönetin
          </Text>
        </View>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Hatırlatıcı ara..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#28a745' }]}>
                {activeReminders.length}
              </Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#6c757d' }]}>
                {inactiveReminders.length}
              </Text>
              <Text style={styles.statLabel}>Pasif</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#007AFF' }]}>
                {reminders.length}
              </Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
          </View>
        </View>

        <View style={styles.categorySection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.key && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.key && styles.categoryButtonTextActive
                  ]}>
                    {category.label} ({category.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.remindersSection}>
          {filteredReminders.length > 0 ? (
            filteredReminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={[styles.reminderColorBar, { backgroundColor: reminder.color }]} />
                
                <View style={styles.reminderContent}>
                  <View style={styles.reminderHeader}>
                    <View style={styles.reminderTitleSection}>
                      <Text style={[
                        styles.reminderTitle,
                        !reminder.isActive && styles.reminderTitleInactive
                      ]}>
                        {reminder.title}
                      </Text>
                      <View style={styles.reminderBadges}>
                        <View style={[styles.categoryBadge, { backgroundColor: reminder.color }]}>
                          <Text style={styles.categoryBadgeText}>{reminder.category}</Text>
                        </View>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: reminder.isActive ? '#d4edda' : '#f8d7da' }
                        ]}>
                          <Text style={[
                            styles.statusBadgeText,
                            { color: reminder.isActive ? '#155724' : '#721c24' }
                          ]}>
                            {reminder.isActive ? 'Aktif' : 'Pasif'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        reminder.isActive && styles.toggleButtonActive
                      ]}
                      onPress={() => handleToggleActive(reminder.id)}
                    >
                      <Text style={styles.toggleButtonText}>
                        {reminder.isActive ? '●' : '○'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.reminderDescription}>{reminder.description}</Text>
                  
                  <View style={styles.reminderDetails}>
                    <Text style={styles.reminderFrequency}>📅 {reminder.frequency}</Text>
                    <Text style={[
                      styles.nextReminder,
                      reminder.isActive ? styles.nextReminderActive : styles.nextReminderInactive
                    ]}>
                      {reminder.isActive ? `⏰ ${reminder.nextReminder}` : '⏸️ Duraklatıldı'}
                    </Text>
                  </View>
                  
                  <View style={styles.reminderActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditReminder(reminder.id)}
                    >
                      <Text style={styles.actionButtonText}>✏️ Düzenle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteActionButton]}
                      onPress={() => handleDeleteReminder(reminder.id)}
                    >
                      <Text style={styles.actionButtonText}>🗑️ Sil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>⏰</Text>
              <Text style={styles.emptyStateTitle}>
                {searchText ? 'Arama sonucu bulunamadı' : 
                 selectedCategory !== 'all' ? 'Bu kategoride hatırlatıcı yok' : 
                 'Henüz özel hatırlatıcı yok'}
              </Text>
              <Text style={styles.emptyStateDescription}>
                {searchText ? 'Farklı anahtar kelimeler deneyin' :
                 selectedCategory !== 'all' ? 'Bu kategoriye hatırlatıcı ekleyin' :
                 'İlk özel hatırlatıcınızı oluşturun'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.templatesSection}>
          <Text style={styles.sectionTitle}>Hızlı Şablonlar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.templatesContainer}>
              {[
                { title: 'Su İç', icon: '💧', category: 'Sağlık' },
                { title: 'Egzersiz', icon: '🏃‍♂️', category: 'Spor' },
                { title: 'Meditasyon', icon: '🧘‍♀️', category: 'Kişisel Gelişim' },
                { title: 'Okuma', icon: '📚', category: 'Kişisel Gelişim' },
                { title: 'Temizlik', icon: '🧹', category: 'Ev İşleri' },
              ].map((template, index) => (
                <TouchableOpacity key={index} style={styles.templateCard}>
                  <Text style={styles.templateIcon}>{template.icon}</Text>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateCategory}>{template.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
        <Text style={styles.addButtonText}>+ Hatırlatıcı Oluştur</Text>
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
  statsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  categorySection: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  remindersSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  reminderCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  reminderColorBar: {
    width: 5,
  },
  reminderContent: {
    flex: 1,
    padding: 15,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reminderTitleSection: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  reminderTitleInactive: {
    color: '#999',
  },
  reminderBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 5,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 5,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  toggleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#28a745',
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  reminderDetails: {
    marginBottom: 15,
  },
  reminderFrequency: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nextReminder: {
    fontSize: 14,
    fontWeight: '500',
  },
  nextReminderActive: {
    color: '#007AFF',
  },
  nextReminderInactive: {
    color: '#999',
  },
  reminderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteActionButton: {
    backgroundColor: '#ffe6e6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
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
  templatesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  templatesContainer: {
    flexDirection: 'row',
  },
  templateCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginRight: 15,
    minWidth: 100,
  },
  templateIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 12,
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
