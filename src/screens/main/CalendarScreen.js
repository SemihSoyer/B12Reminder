import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT_STYLES } from '../../constants/fonts';

export default function CalendarScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Takvim</Text>
        <Text style={styles.subtitle}>Takvim özellikleri buraya gelecek</Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    ...FONT_STYLES.heading1,
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    ...FONT_STYLES.bodyLarge,
    color: '#666',
    textAlign: 'center',
  },
});