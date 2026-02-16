import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseService } from '../services/purchaseService';

const PREMIUM_CACHE_KEY = '@kawaii_premium_status';

interface PremiumStore {
  isPremium: boolean;
  isLoading: boolean;
  isTestMode: boolean;
  showFallbackPaywall: boolean;

  // Actions
  initialize: () => Promise<void>;
  presentPaywall: () => Promise<boolean>;
  presentPaywallIfNeeded: () => Promise<boolean>;
  presentCustomerCenter: () => Promise<void>;
  restore: () => Promise<boolean>;
  setPremium: (value: boolean) => void;
  toggleTestPremium: () => void;
  setShowFallbackPaywall: (value: boolean) => void;
}

export const usePremiumStore = create<PremiumStore>((set, get) => ({
  isPremium: false,
  isLoading: true,
  isTestMode: false,
  showFallbackPaywall: false,

  initialize: async () => {
    try {
      // Load cached status first for instant UI
      const cached = await AsyncStorage.getItem(PREMIUM_CACHE_KEY);
      if (cached === 'true') {
        set({ isPremium: true });
      }

      // Initialize RevenueCat
      await PurchaseService.initialize();

      // Verify with RevenueCat (source of truth)
      const isPremium = await PurchaseService.checkPremiumStatus();
      set({ isPremium, isLoading: false });
      await AsyncStorage.setItem(PREMIUM_CACHE_KEY, isPremium ? 'true' : 'false');

      // Listen for future changes
      PurchaseService.onCustomerInfoUpdated(async (premium) => {
        set({ isPremium: premium });
        await AsyncStorage.setItem(PREMIUM_CACHE_KEY, premium ? 'true' : 'false');
      });
    } catch {
      set({ isLoading: false });
    }
  },

  presentPaywall: async () => {
    try {
      set({ isLoading: true });
      const success = await PurchaseService.presentPaywall();
      if (success) {
        set({ isPremium: true, isLoading: false });
        await AsyncStorage.setItem(PREMIUM_CACHE_KEY, 'true');
      } else {
        set({ isLoading: false });
      }
      return success;
    } catch {
      // RevenueCat UI not available (e.g. Expo Go) — show fallback paywall only in dev
      set({ isLoading: false, showFallbackPaywall: __DEV__ });
      return false;
    }
  },

  presentPaywallIfNeeded: async () => {
    try {
      const success = await PurchaseService.presentPaywallIfNeeded();
      if (success) {
        set({ isPremium: true });
        await AsyncStorage.setItem(PREMIUM_CACHE_KEY, 'true');
      }
      return success;
    } catch {
      return false;
    }
  },

  presentCustomerCenter: async () => {
    try {
      await PurchaseService.presentCustomerCenter();
      // Re-check premium status after Customer Center closes
      const isPremium = await PurchaseService.checkPremiumStatus();
      set({ isPremium });
      await AsyncStorage.setItem(PREMIUM_CACHE_KEY, isPremium ? 'true' : 'false');
    } catch {
      // Silently fail
    }
  },

  restore: async () => {
    try {
      set({ isLoading: true });
      const success = await PurchaseService.restorePurchases();
      set({ isPremium: success, isLoading: false });
      await AsyncStorage.setItem(PREMIUM_CACHE_KEY, success ? 'true' : 'false');
      return success;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  setPremium: (value) => {
    set({ isPremium: value });
    AsyncStorage.setItem(PREMIUM_CACHE_KEY, value ? 'true' : 'false');
  },

  toggleTestPremium: () => {
    const current = get().isPremium;
    set({ isPremium: !current, isTestMode: true });
    AsyncStorage.setItem(PREMIUM_CACHE_KEY, !current ? 'true' : 'false');
  },

  setShowFallbackPaywall: (value) => {
    set({ showFallbackPaywall: value });
  },
}));
