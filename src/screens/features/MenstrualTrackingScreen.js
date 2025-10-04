import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FONT_STYLES } from '../../constants/fonts';
import { spacing } from '../../constants/responsive';

// Components
import CycleOverview from '../../components/menstrual/CycleOverview';
import StartPeriodButton from '../../components/menstrual/StartPeriodButton';
import StartPeriodForm from '../../components/menstrual/StartPeriodForm';
import EmptyState from '../../components/menstrual/EmptyState';
import MenstrualCalendar from '../../components/menstrual/MenstrualCalendar';
import CycleHistoryList from '../../components/menstrual/CycleHistoryList';
import StatisticsCard from '../../components/menstrual/StatisticsCard';
import InfoModal from '../../components/menstrual/InfoModal';

// Services & Utils
import { MenstrualService } from '../../utils/storage';
import { 
  predictNextPeriod, 
  calculateFertileWindow, 
  getCurrentPhase 
} from '../../utils/menstrualUtils';
import { showAlert } from '../../components/ui/CustomAlert';

// Debug (geliştirme aşamasında kullanılacak)
import { debugMenstrualData, resetMenstrualData } from '../../utils/debugMenstrual';

export default function MenstrualTrackingScreen({ navigation }) {
  const [menstrualData, setMenstrualData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPeriodDate, setNextPeriodDate] = useState(null);
  const [fertileWindow, setFertileWindow] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [showStartForm, setShowStartForm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
      checkFirstTimeUser();
    }, [])
  );

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenInfo = await MenstrualService.hasSeenInfo();
      if (!hasSeenInfo) {
        // İlk açılışta 500ms sonra modal'i göster (yükleme animasyonundan sonra)
        setTimeout(() => {
          setShowInfoModal(true);
        }, 500);
      }
    } catch (error) {
      console.error('Error checking first time user:', error);
    }
  };

  const handleCloseInfoModal = async () => {
    setShowInfoModal(false);
    // Bilgiyi kaydet ki bir daha gösterilmesin
    await MenstrualService.setInfoShown();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await MenstrualService.getMenstrualData();
      
      // Debug için konsola yazdır
      console.log('📊 Menstrual Data:', {
        lastPeriodStart: data.lastPeriodStart,
        averageCycle: data.averageCycleLength,
        cyclesCount: data.cycles.length
      });
      setMenstrualData(data);

      // Sonraki regl tarihini hesapla
      if (data.lastPeriodStart) {
        const nextDate = predictNextPeriod(data.lastPeriodStart, data.averageCycleLength);
        setNextPeriodDate(nextDate);

        // Verimli dönemi hesapla
        const fertile = calculateFertileWindow(nextDate);
        setFertileWindow(fertile);

        // Mevcut fazı hesapla
        const phase = getCurrentPhase(
          data.lastPeriodStart,
          data.averageCycleLength,
          data.averagePeriodLength
        );
        setCurrentPhase(phase);
      } else {
        setNextPeriodDate(null);
        setFertileWindow(null);
        setCurrentPhase(null);
      }
    } catch (error) {
      console.error('Error loading menstrual data:', error);
      showAlert('Hata', 'Veriler yüklenirken bir sorun oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartPeriod = () => {
    setShowStartForm(true);
  };

  const handleFormSubmit = async (startDate, periodLength) => {
    try {
      await MenstrualService.startNewPeriod(startDate, periodLength);
      await loadData();
      
      setTimeout(() => {
        showAlert(
          'Başarılı!',
          'Regl döneminiz kaydedildi.',
          'success'
        );
      }, 300);
    } catch (error) {
      console.error('Error starting period:', error);
      showAlert('Hata', 'Regl kaydedilirken bir sorun oluştu.', 'error');
    }
  };

  const handleDeleteCycle = (cycle) => {
    showAlert(
      'Döngüyü Sil',
      'Bu döngü kaydını silmek istediğinizden emin misiniz?',
      'warning',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await MenstrualService.deleteCycle(cycle.id);
              await loadData();
              
              setTimeout(() => {
                showAlert('Silindi!', 'Döngü kaydı silindi.', 'success');
              }, 200);
            } catch (error) {
              console.error('Error deleting cycle:', error);
              showAlert('Hata', 'Silme işlemi sırasında bir sorun oluştu.', 'error');
            }
          },
        },
      ]
    );
  };

  // Debug: Tüm verileri temizle
  const handleResetAllData = () => {
    Alert.alert(
      '⚠️ Tüm Verileri Sil',
      'Tüm regl takip verileri silinecek. Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            const success = await resetMenstrualData();
            if (success) {
              await loadData();
              setTimeout(() => {
                showAlert('Başarılı', 'Tüm veriler temizlendi', 'success');
              }, 200);
            }
          },
        },
      ]
    );
  };

  const hasData = menstrualData && menstrualData.lastPeriodStart;

  return (
    <>
      <LinearGradient
        colors={['#F7F7F7', '#FAFAFA', '#F5F5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
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
            <Text style={styles.title}>Regl Takibi</Text>
            
            {/* Header Right Buttons */}
            <View style={styles.headerRightButtons}>
              {/* Info Button - Her zaman görünür */}
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setShowInfoModal(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={24} color="#FF6B9D" />
              </TouchableOpacity>
              
              {/* Debug: Reset butonu (sadece development modda) */}
              {__DEV__ && hasData && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetAllData}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {hasData ? (
              <>
                {/* Döngü Özeti */}
                <CycleOverview
                  nextPeriodDate={nextPeriodDate}
                  currentPhase={currentPhase}
                />

                {/* Takvim */}
                <MenstrualCalendar
                  menstrualData={menstrualData}
                  fertileWindow={fertileWindow}
                />

                {/* İstatistikler */}
                {menstrualData.cycles.length > 0 && (
                  <StatisticsCard menstrualData={menstrualData} />
                )}

                {/* Geçmiş Döngüler */}
                {menstrualData.cycles.length > 0 && (
                  <CycleHistoryList
                    cycles={[...menstrualData.cycles].reverse().slice(0, 5)}
                    onDelete={handleDeleteCycle}
                  />
                )}

                {/* Bilgi Kartı */}
                <View style={styles.infoCard}>
                  <View style={styles.infoHeader}>
                    <Ionicons name="information-circle" size={20} color="#00B894" />
                    <Text style={styles.infoTitle}>Tahminler Hakkında</Text>
                  </View>
                  <Text style={styles.infoText}>
                    Gösterilen tarihler geçmiş döngülerinize göre tahminidir.
                    Her kadının döngüsü farklıdır ve değişkenlik gösterebilir.
                  </Text>
                </View>
              </>
            ) : (
              <EmptyState />
            )}
          </ScrollView>

          {/* Start Period Button */}
          <View style={styles.buttonSection}>
            <StartPeriodButton onPress={handleStartPeriod} />
          </View>
        </SafeAreaView>

        {/* Start Period Form Modal */}
        <StartPeriodForm
          visible={showStartForm}
          onClose={() => setShowStartForm(false)}
          onSubmit={handleFormSubmit}
        />

        {/* Info Modal - İlk açılış */}
        <InfoModal
          visible={showInfoModal}
          onClose={handleCloseInfoModal}
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
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    ...FONT_STYLES.emphasisMedium,
    color: '#00B894',
  },
  infoText: {
    ...FONT_STYLES.bodySmall,
    color: '#666',
    lineHeight: 20,
  },
  buttonSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});