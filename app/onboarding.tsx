import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  ViewToken,
  Alert,
  Linking,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import OnboardingSlide, { SlideData } from '../src/components/OnboardingSlide';
import NameInput from '../src/components/NameInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius, Shadows } from '../src/constants/theme';
import CatWithClockIllustration from '../src/components/illustrations/CatWithClockIllustration';
import CatWithListIllustration from '../src/components/illustrations/CatWithListIllustration';
import CatShowcaseIllustration from '../src/components/illustrations/CatShowcaseIllustration';
import CatWithBellIllustration from '../src/components/illustrations/CatWithBellIllustration';
import { NotificationService } from '../src/services/notificationService';
import { useNotificationStore } from '../src/stores/notificationStore';
import { registerBackgroundFetch } from '../src/services/backgroundTaskService';

const NOTIF_PROMPTED_KEY = '@kawaii_notif_prompted';

const SLIDES: SlideData[] = [
  {
    id: '1',
    Illustration: CatWithClockIllustration,
    subtitle: 'Welcome to Kawaii Pills',
    title: 'Never Miss a\nDose Again',
    description: 'Smart, gentle reminders that keep you on track — because your health matters.',
  },
  {
    id: '2',
    Illustration: CatWithListIllustration,
    subtitle: 'Simple & Fast',
    title: 'Quick & Easy\nSetup',
    description: 'Add your pills in seconds. We handle the scheduling, you just tap when done.',
  },
  {
    id: '3',
    Illustration: CatShowcaseIllustration,
    subtitle: 'Your Companions',
    title: 'Collect Kawaii\nCats!',
    description: 'Earn coins by taking your pills and unlock adorable cat companions in the shop!',
  },
  {
    id: '4',
    Illustration: CatWithBellIllustration,
    subtitle: 'Stay on Track',
    title: 'Turn On\nReminders',
    description: 'Allow notifications so we can gently remind you when it\'s time for your pills.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNameInput, setShowNameInput] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const bottomSlide = useRef(new Animated.Value(40)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bottomSlide, { toValue: 0, duration: 600, delay: 400, easing: Easing.out(Easing.back(1.05)), useNativeDriver: true }),
      Animated.timing(bottomOpacity, { toValue: 1, duration: 500, delay: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.94, damping: 15, stiffness: 400, useNativeDriver: true }).start();
  };
  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }).start();
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const requestNotificationPermission = async () => {
    try {
      // Check current status first
      const currentStatus = await NotificationService.getPermissionStatus();

      if (currentStatus === 'granted') {
        // Already granted — just set up everything
        useNotificationStore.getState().setPermissionStatus('granted');
        await AsyncStorage.setItem(NOTIF_PROMPTED_KEY, 'true');
        await NotificationService.setupNotificationChannels();
        await NotificationService.setupNotificationCategories();
        const prefs = useNotificationStore.getState().preferences;
        if (prefs.masterEnabled && prefs.dailySummary) {
          NotificationService.scheduleDailySummary().catch(() => {});
        }
        registerBackgroundFetch().catch(() => {});
        return;
      }

      if (currentStatus === 'denied') {
        // OS won't show prompt again — direct user to Settings
        Alert.alert(
          'Notifications Disabled',
          'You previously denied notifications. Please enable them in your device Settings to get pill reminders.',
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      // Status is undetermined — show the OS prompt
      const granted = await NotificationService.requestPermissions();
      useNotificationStore.getState().setPermissionStatus(
        granted ? 'granted' : 'denied'
      );

      if (granted) {
        await AsyncStorage.setItem(NOTIF_PROMPTED_KEY, 'true');
        await NotificationService.setupNotificationChannels();
        await NotificationService.setupNotificationCategories();

        const prefs = useNotificationStore.getState().preferences;
        if (prefs.masterEnabled && prefs.dailySummary) {
          NotificationService.scheduleDailySummary().catch(() => {});
        }

        registerBackgroundFetch().catch(() => {});
      }
    } catch {
      // Permission request failed, continue gracefully
    }
  };

  const handleNext = async () => {
    // On the notification slide, request permissions before advancing
    if (currentIndex === 3) {
      await requestNotificationPermission();
      // Transition to name input
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowNameInput(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
      return;
    }

    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowNameInput(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  const getButtonText = () => {
    if (currentIndex === 3) return 'Enable & Continue';
    if (currentIndex === SLIDES.length - 1) return 'Continue';
    return 'Next';
  };

  if (showNameInput) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <NameInput onComplete={handleComplete} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <OnboardingSlide
            item={item}
            currentIndex={currentIndex}
            totalSlides={SLIDES.length}
          />
        )}
      />

      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY: bottomSlide }], opacity: bottomOpacity }]}>
        {currentIndex === 3 && (
          <TouchableOpacity
            style={styles.skipNotifButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipNotifText}>Maybe Later</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.nextButton,
              currentIndex === 3 && styles.notifButton,
              { transform: [{ scale: buttonScale }] },
            ]}
          >
            <Text style={styles.nextButtonText}>{getButtonText()}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
    opacity: 0.7,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  nextButton: {
    height: 56,
    backgroundColor: Colors.warm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.warm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  notifButton: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  skipNotifButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipNotifText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.lightText,
  },
});
