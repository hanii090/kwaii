import { useEffect, useState, useRef } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCatStore } from '../src/stores/catStore';
import { useMedicationStore } from '../src/stores/medicationStore';
import { useNotificationStore } from '../src/stores/notificationStore';
import { NotificationService } from '../src/services/notificationService';
import { registerBackgroundFetch } from '../src/services/backgroundTaskService';
import NotificationPermissionModal from '../src/components/modals/NotificationPermissionModal';
import { Colors } from '../src/constants/theme';
import { usePremiumStore } from '../src/stores/premiumStore';
import ErrorBoundary from '../src/components/ErrorBoundary';

const NOTIF_PROMPTED_KEY = '@kawaii_notif_prompted';

export default function RootLayout() {
  const { loadOnboardingState } = useCatStore();
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      const completed = await loadOnboardingState();
      setHasOnboarded(completed);

      // Initialize RevenueCat and check premium status
      await usePremiumStore.getState().initialize();

      // Load notification preferences
      await useNotificationStore.getState().loadPreferences();

      // Setup channels, categories, and listeners (no permission request)
      await NotificationService.setupNotificationChannels();
      await NotificationService.setupNotificationCategories();
      NotificationService.registerNotificationHandlers();

      // Check current permission status (don't prompt — onboarding handles that)
      const permStatus = await NotificationService.getPermissionStatus();
      const hasPermission = permStatus === 'granted';
      useNotificationStore.getState().setPermissionStatus(
        permStatus === 'granted' ? 'granted' : permStatus === 'denied' ? 'denied' : 'undetermined'
      );

      // For existing users who somehow never got prompted, show fallback modal
      if (!hasPermission && completed) {
        const alreadyPrompted = await AsyncStorage.getItem(NOTIF_PROMPTED_KEY);
        if (!alreadyPrompted) {
          setShowPermissionModal(true);
        }
      }

      // Schedule daily summary if enabled and permitted
      const notifPrefs = useNotificationStore.getState().preferences;
      if (hasPermission && notifPrefs.masterEnabled && notifPrefs.dailySummary) {
        NotificationService.scheduleDailySummary().catch(() => {});
      }

      // Update badge count
      const pending = useMedicationStore.getState().medications.filter((m) => !m.taken).length;
      NotificationService.updateBadgeCount(pending).catch(() => {});

      // Register background task for encouragement
      registerBackgroundFetch().catch(() => {});

      // Handle notification responses (e.g. mark as taken from notification action)
      NotificationService.setOnNotificationResponse((data) => {
        if (data.action === 'mark_taken' && data.medicationId) {
          const { markMedicationTaken } = useMedicationStore.getState();
          const { addXp, addCoins, incrementMedsTaken } = useCatStore.getState();
          const success = markMedicationTaken(data.medicationId);
          if (success) {
            incrementMedsTaken();
            addXp(10);
            addCoins(5);
          }
        }
      });

      // Check if we need to reset medications for a new day
      useMedicationStore.getState().checkAndResetIfNewDay();

      // Mark ready AFTER all setup (fixes race condition with permission modal)
      setIsReady(true);
    };
    init();

    return () => {
      NotificationService.cleanup();
    };
  }, []);

  // Re-check daily reset when app comes to foreground
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        useMedicationStore.getState().checkAndResetIfNewDay();
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!hasOnboarded) {
      router.replace('/onboarding');
    } else {
      router.replace('/(tabs)');
    }
  }, [isReady, hasOnboarded]);

  const handleAllowNotifications = async () => {
    const granted = await NotificationService.requestPermissions();
    useNotificationStore.getState().setPermissionStatus(granted ? 'granted' : 'denied');
    await AsyncStorage.setItem(NOTIF_PROMPTED_KEY, 'true');
    setShowPermissionModal(false);
  };

  const handleDenyNotifications = async () => {
    await AsyncStorage.setItem(NOTIF_PROMPTED_KEY, 'true');
    setShowPermissionModal(false);
  };

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.warm} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <NotificationPermissionModal
        visible={showPermissionModal}
        onAllow={handleAllowNotifications}
        onDeny={handleDenyNotifications}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-medication"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="calendar"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        {__DEV__ && (
          <Stack.Screen
            name="notification-test"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        )}
      </Stack>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
