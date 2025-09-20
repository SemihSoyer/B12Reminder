import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00B894', '#00CEC9', '#74B9FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tabBar}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIconName = (routeName, focused) => {
            switch (routeName) {
              case 'Dashboard':
                return focused ? 'home' : 'home-outline';
              case 'Calendar':
                return focused ? 'grid' : 'grid-outline';
              case 'Profile':
                return focused ? 'person' : 'person-outline';
              default:
                return 'home-outline';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.activeTabItem
              ]}
              activeOpacity={0.7}
            >
{isFocused ? (
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.iconContainer, styles.activeIconContainer]}
                >
                  <Ionicons
                    name={getIconName(route.name, isFocused)}
                    size={26}
                    color="#00B894"
                  />
                </LinearGradient>
              ) : (
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={getIconName(route.name, isFocused)}
                    size={26}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34, // iPhone safe area
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 35,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#00B894',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  activeTabItem: {
    // Active tab için ekstra stil gerekirse
  },
  iconContainer: {
    width: 70,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
});
