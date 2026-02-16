import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseService } from '../services/purchaseService';

const PREMIUM_CACHE_KEY = '@kawaii_premium_status';

interface PremiumStore {
  isPremium: boolean;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  purchase: () => Promise<boolean>;
  restore: () => Promise<boolean>;
  setPremium: (value: boolean) => void;
}

export const usePremiumStore = create<PremiumStore>((set, get) => ({
  isPremium: false,
  isLoading: true,

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

  purchase: async () => {
    try {
      set({ isLoading: true });
      const success = await PurchaseService.purchasePremium();
      if (success) {
        set({ isPremium: true, isLoading: false });
        await AsyncStorage.setItem(PREMIUM_CACHE_KEY, 'true');
      } else {
        set({ isLoading: false });
      }
      return success;
    } catch {
      set({ isLoading: false });
      return false;
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
}));
