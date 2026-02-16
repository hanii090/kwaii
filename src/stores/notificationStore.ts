import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationPreferences } from '../types';

const NOTIFICATION_PREFS_KEY = '@kawaii_notification_prefs';

interface NotificationStore {
  preferences: NotificationPreferences;
  permissionStatus: 'undetermined' | 'granted' | 'denied';
  isInitialized: boolean;

  // Actions
  setPermissionStatus: (status: 'undetermined' | 'granted' | 'denied') => void;
  setPreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => void;
  setMasterEnabled: (enabled: boolean) => void;
  loadPreferences: () => Promise<void>;
  savePreferences: () => Promise<void>;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  masterEnabled: true,
  medicationReminders: true,
  celebrations: true,
  streakMilestones: true,
  encouragement: true,
  dailySummary: true,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: 22, // 10 PM
  quietHoursEnd: 8,    // 8 AM
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  preferences: { ...DEFAULT_PREFERENCES },
  permissionStatus: 'undetermined',
  isInitialized: false,

  setPermissionStatus: (status) => {
    set({ permissionStatus: status });
  },

  setPreference: (key, value) => {
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    }));
    // Persist after update
    setTimeout(() => get().savePreferences(), 0);
  },

  setMasterEnabled: (enabled) => {
    set((state) => ({
      preferences: { ...state.preferences, masterEnabled: enabled },
    }));
    setTimeout(() => get().savePreferences(), 0);
  },

  loadPreferences: async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<NotificationPreferences>;
        set((state) => ({
          preferences: { ...state.preferences, ...parsed },
          isInitialized: true,
        }));
      } else {
        set({ isInitialized: true });
      }
    } catch {
      set({ isInitialized: true });
    }
  },

  savePreferences: async () => {
    try {
      const { preferences } = get();
      await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(preferences));
    } catch {
      // Silently fail
    }
  },
}));
