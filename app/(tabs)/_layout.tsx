import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Tabs, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Home, Cat, Plus, ShoppingBag, Settings as SettingsIcon } from 'lucide-react-native';
import { Colors, Spacing, Shadows } from '../../src/constants/theme';

interface TabButtonProps {
  focused: boolean;
  Icon: React.ElementType;
  label: string;
}

function TabButton({ focused, Icon }: TabButtonProps) {
  return (
    <View style={[styles.tabButton, focused && styles.tabButtonActive]}>
      <Icon
        size={22}
        color={focused ? Colors.primary : Colors.inactive}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => (
          <BlurView
            tint="systemChromeMaterialLight"
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton focused={focused} Icon={Home} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton focused={focused} Icon={Cat} label="Cats" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <View style={styles.fabButton}>
                <Plus size={28} color={Colors.white} strokeWidth={3} />
              </View>
            </View>
          ),
          tabBarButton: ({ children }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/add-medication')}
              style={styles.fabTouchable}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton focused={focused} Icon={ShoppingBag} label="Shop" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton focused={focused} Icon={SettingsIcon} label="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 64;
const BOTTOM_INSET = Platform.OS === 'ios' ? 28 : 10;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.95)',
    borderTopWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
    paddingHorizontal: Spacing.sm,
    paddingTop: 4,
    paddingBottom: BOTTOM_INSET,
  },
  tabBarItem: {
    height: TAB_BAR_HEIGHT - BOTTOM_INSET - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(212,231,214,0.65)',
  },
  fabTouchable: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.warm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.warm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: Colors.white,
  },
});
