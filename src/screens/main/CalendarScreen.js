import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function CalendarScreen({ navigation }) {
  const [selectedView, setSelectedView] = useState('month'); // month, week, day

  const viewOptions = [
    { key: 'month', label: 'Aylık' },
    { key: 'week', label: 'Haftalık' },
    { key: 'day', label: 'Günlük' }
  ];

  const mockEvents = [
    {
      id: 1,
      title: 'Ahmet\'in Doğum Günü',
      date: '2024-01-15',
      type: 'birthday',
      color: '#FF6B6B'
    },
    {
      id: 2,
      title: 'İlaç Zamanı - Vitamin D',
      date: '2024-01-16',
      type: 'medication',
      color: '#4ECDC4'
    },
    {
      id: 3,
      title: 'Özel Hatırlatıcı',
      date: '2024-01-18',
      type: 'custom',
      color: '#45B7D1'
    }
  ];

  const renderCalendarPlaceholder = () => {
    return (
      <View style={styles.calendarPlaceholder}>
        <Text style={styles.calendarIcon}>📅</Text>
        <Text style={styles.calendarTitle}>Takvim Görünümü</Text>
        <Text style={styles.calendarSubtitle}>
          {selectedView === 'month' && 'Aylık görünüm aktif'}
          {selectedView === 'week' && 'Haftalık görünüm aktif'}
          {selectedView === 'day' && 'Günlük görünüm aktif'}
        </Text>
        <Text style={styles.calendarNote}>
          Gerçek takvim bileşeni burada entegre edilecek
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Takvim</Text>
        <View style={styles.viewSelector}>
          {viewOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.viewOption,
                selectedView === option.key && styles.viewOptionActive
              ]}
              onPress={() => setSelectedView(option.key)}
            >
              <Text style={[
                styles.viewOptionText,
                selectedView === option.key && styles.viewOptionTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCalendarPlaceholder()}

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
          {mockEvents.length > 0 ? (
            mockEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <View style={styles.eventType}>
                  <Text style={styles.eventTypeText}>
                    {event.type === 'birthday' && '🎂'}
                    {event.type === 'medication' && '💊'}
                    {event.type === 'custom' && '⏰'}
                    {event.type === 'menstrual' && '📅'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noEventsCard}>
              <Text style={styles.noEventsText}>Yaklaşan etkinlik yok</Text>
              <TouchableOpacity
                style={styles.addEventButton}
                onPress={() => navigation.navigate('Dashboard')}
              >
                <Text style={styles.addEventButtonText}>Hatırlatıcı Ekle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.legendSection}>
          <Text style={styles.sectionTitle}>Renk Kodları</Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.legendText}>Doğum Günleri</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF8E9B' }]} />
              <Text style={styles.legendText}>Regl Takibi</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.legendText}>İlaçlar</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#45B7D1' }]} />
              <Text style={styles.legendText}>Özel</Text>
            </View>
          </View>
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  viewOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  viewOptionActive: {
    backgroundColor: '#007AFF',
  },
  viewOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  viewOptionTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  calendarPlaceholder: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  calendarIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  calendarSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  calendarNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  eventsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  eventColorBar: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  eventContent: {
    flex: 1,
    padding: 15,
    paddingLeft: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  eventType: {
    padding: 15,
  },
  eventTypeText: {
    fontSize: 20,
  },
  noEventsCard: {
    alignItems: 'center',
    padding: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  addEventButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addEventButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  legendSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});
