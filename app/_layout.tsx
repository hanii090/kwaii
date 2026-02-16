import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCatStore } from '../src/stores/catStore';
import { useMedicationStore } from '../src/stores/medicationStore';
import { useNotificationStore } from '../src/stores/notificationStore';
import { NotificationService } from '../src/services/notificationService';
import { registerBackgroundFetch } from '../src/services/backgroundTaskService';
import NotificationPermissionModal from '../src/components/modals/NotificationPermissionModal';
import { Colors } from '../src/constants/theme';

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
      setIsReady(true);

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
    };
    init();

    return () => {
      NotificationService.cleanup();
    };
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
    <>
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
        <Stack.Screen
          name="notification-test"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
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
