import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SafeAreaWrapper({ children, backgroundColor = '#f8f9fa', statusBarStyle = 'dark' }) {
  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor }]}>
        <StatusBar style={statusBarStyle} backgroundColor={backgroundColor} translucent={false} />
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {children}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
