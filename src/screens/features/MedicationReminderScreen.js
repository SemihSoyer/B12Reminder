import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

// Components
import EmptyState from '../../components/medication/EmptyState';
import AddMedicationButton from '../../components/medication/AddMedicationButton';
import AddMedicationForm from '../../components/medication/AddMedicationForm';
import MedicationList from '../../components/medication/MedicationList';
import { MedicationService } from '../../utils/storage';

export default function MedicationReminderScreen({ navigation }) {
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde ilaçları getir
  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const storedMedications = await MedicationService.getAllMedications();
      setMedications(storedMedications);
    } catch (error) {
      Alert.alert('Hata', 'İlaçlar yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormAdd = async (newMedication) => {
    try {
      const savedMedication = await MedicationService.addMedication(newMedication);
      if (savedMedication) {
        setMedications(prev => [...prev, savedMedication]);
        Alert.alert('Başarılı!', `${savedMedication.name} eklendi.`);
      } else {
        Alert.alert('Hata', 'İlaç eklenirken bir sorun oluştu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'İlaç eklenirken bir hata oluştu.');
    }
  };

  const handleDelete = async (medicationToDelete) => {
    try {
      const success = await MedicationService.deleteMedication(medicationToDelete.id);
      if (success) {
        setMedications(prev => prev.filter(item => item.id !== medicationToDelete.id));
        Alert.alert('Silindi!', `${medicationToDelete.name} silindi.`);
      } else {
        Alert.alert('Hata', 'İlaç silinirken bir sorun oluştu.');
      }
    } catch (error) {
        Alert.alert('Hata', 'İlaç silinirken bir hata oluştu.');
    }
  };

  const hasMedications = medications.length > 0;

  return (
    <>
      <LinearGradient
        colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>İlaç Hatırlatıcıları</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>
              {hasMedications ? 'İlaçların' : 'Hatırlatıcılar'}
            </Text>
            {loading ? (
              <EmptyState message="İlaçlar yükleniyor..." />
            ) : hasMedications ? (
              <MedicationList
                medications={medications}
                onDelete={handleDelete}
              />
            ) : (
              <EmptyState />
            )}
          </ScrollView>

          {/* Add Button */}
          <View style={styles.buttonSection}>
            <AddMedicationButton onPress={() => setShowAddForm(true)} />
          </View>
        </SafeAreaView>

        {/* Add Medication Form Modal */}
        <AddMedicationForm
          visible={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdd={handleFormAdd}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONT_STYLES.heading1,
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...FONT_STYLES.heading3,
    color: '#1a1a1a',
    marginBottom: spacing.md,
  },
  buttonSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
