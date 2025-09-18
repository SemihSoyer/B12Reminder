import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CustomHeader from '../../components/common/CustomHeader';
import { fontSizes, spacing } from '../../constants/responsive';

export default function MedicationReminderScreen({ navigation }) {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Günde 1 kez',
      time: '09:00',
      nextDose: '2 saat sonra',
      color: '#4ecdc4',
      taken: false
    },
    {
      id: 2,
      name: 'Omega-3',
      dosage: '1000 mg',
      frequency: 'Günde 2 kez',
      time: '08:00, 20:00',
      nextDose: '1 saat sonra',
      color: '#ffe66d',
      taken: true
    },
    {
      id: 3,
      name: 'Magnezyum',
      dosage: '200 mg',
      frequency: 'Günde 1 kez',
      time: '22:00',
      nextDose: '13 saat sonra',
      color: '#ff8e53',
      taken: false
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all'); // all, pending, taken

  const handleAddMedication = () => {
    Alert.alert('Yeni İlaç', 'İlaç ekleme özelliği yakında eklenecek');
  };

  const handleMarkTaken = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const handleEditMedication = (id) => {
    Alert.alert('Düzenle', `İlaç düzenleme özelliği yakında eklenecek (ID: ${id})`);
  };

  const handleDeleteMedication = (id) => {
    Alert.alert(
      'Sil',
      'Bu ilacı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => setMedications(medications.filter(m => m.id !== id))
        }
      ]
    );
  };

  const filteredMedications = medications.filter(med => {
    if (selectedFilter === 'pending') return !med.taken;
    if (selectedFilter === 'taken') return med.taken;
    return true;
  });

  const todayStats = {
    total: medications.length,
    taken: medications.filter(m => m.taken).length,
    pending: medications.filter(m => !m.taken).length
  };

  const filterOptions = [
    { key: 'all', label: 'Tümü', count: todayStats.total },
    { key: 'pending', label: 'Bekleyen', count: todayStats.pending },
    { key: 'taken', label: 'Alınan', count: todayStats.taken }
  ];

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <CustomHeader 
        title="İlaç Hatırlatma"
        onBackPress={() => navigation.goBack()}
        backgroundColor="#f8f9fa"
      />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Bugün</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#007AFF' }]}>
                {todayStats.total}
              </Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#28a745' }]}>
                {todayStats.taken}
              </Text>
              <Text style={styles.statLabel}>Alınan</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#ff9500' }]}>
                {todayStats.pending}
              </Text>
              <Text style={styles.statLabel}>Bekleyen</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(todayStats.taken / todayStats.total) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round((todayStats.taken / todayStats.total) * 100)}% tamamlandı
            </Text>
          </View>
        </View>

        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterContainer}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterButton,
                    selectedFilter === option.key && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedFilter(option.key)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedFilter === option.key && styles.filterButtonTextActive
                  ]}>
                    {option.label} ({option.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.medicationsSection}>
          {filteredMedications.length > 0 ? (
            filteredMedications.map((medication) => (
              <View key={medication.id} style={styles.medicationCard}>
                <View style={[styles.medicationColorBar, { backgroundColor: medication.color }]} />
                
                <View style={styles.medicationContent}>
                  <View style={styles.medicationHeader}>
                    <Text style={[
                      styles.medicationName,
                      medication.taken && styles.medicationTaken
                    ]}>
                      {medication.name}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.checkButton,
                        medication.taken && styles.checkButtonActive
                      ]}
                      onPress={() => handleMarkTaken(medication.id)}
                    >
                      <Text style={styles.checkButtonText}>
                        {medication.taken ? '✓' : '○'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.medicationDetails}>
                    <Text style={styles.medicationDosage}>{medication.dosage}</Text>
                    <Text style={styles.medicationFrequency}>{medication.frequency}</Text>
                    <Text style={styles.medicationTime}>Saat: {medication.time}</Text>
                    <Text style={[
                      styles.nextDose,
                      medication.taken ? styles.nextDoseTaken : styles.nextDosePending
                    ]}>
                      {medication.taken ? 'Alındı ✓' : `Sonraki: ${medication.nextDose}`}
                    </Text>
                  </View>
                  
                  <View style={styles.medicationActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditMedication(medication.id)}
                    >
                      <Text style={styles.actionButtonText}>✏️ Düzenle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteActionButton]}
                      onPress={() => handleDeleteMedication(medication.id)}
                    >
                      <Text style={styles.actionButtonText}>🗑️ Sil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💊</Text>
              <Text style={styles.emptyStateTitle}>
                {selectedFilter === 'all' ? 'Henüz ilaç yok' :
                 selectedFilter === 'pending' ? 'Bekleyen ilaç yok' :
                 'Alınan ilaç yok'}
              </Text>
              <Text style={styles.emptyStateDescription}>
                {selectedFilter === 'all' ? 'İlk ilacınızı ekleyerek başlayın' :
                 selectedFilter === 'pending' ? 'Tüm ilaçlar alındı!' :
                 'Bugün henüz ilaç alınmadı'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>İpuçları</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>İlaç Alma Hatırlatması</Text>
              <Text style={styles.tipText}>
                İlaçlarınızı her gün aynı saatte almaya çalışın. Bu, vücudunuzun ilaca alışmasını kolaylaştırır.
              </Text>
            </View>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>⚠️</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Önemli Uyarı</Text>
              <Text style={styles.tipText}>
                İlaç dozajınızı değiştirmeden önce mutlaka doktorunuza danışın.
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
          <Text style={styles.addButtonText}>+ İlaç Ekle</Text>
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
  statsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  medicationsSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  medicationCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  medicationColorBar: {
    width: 5,
  },
  medicationContent: {
    flex: 1,
    padding: 15,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  medicationTaken: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkButtonText: {
    fontSize: 16,
    color: '#28a745',
  },
  medicationDetails: {
    marginBottom: 15,
  },
  medicationDosage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  medicationFrequency: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  medicationTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nextDose: {
    fontSize: 14,
    fontWeight: '500',
  },
  nextDosePending: {
    color: '#ff9500',
  },
  nextDoseTaken: {
    color: '#28a745',
  },
  medicationActions: {
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
  tipsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 13,
    color: '#1976d2',
    lineHeight: 18,
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
