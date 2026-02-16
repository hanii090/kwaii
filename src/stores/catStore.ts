import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Cat, CatBreed, CatState, Preferences, UserProfile } from '../types';

const ONBOARDING_KEY = '@kawaii_meds_onboarding_complete';
const USER_PROFILE_KEY = '@kawaii_meds_user_profile';
const CATS_KEY = '@kawaii_meds_cats';

export type CatMood = CatState;

const DEFAULT_CAT: Cat = {
  id: 'cat_starter',
  breed: 'basic',
  name: 'Snowball',
  level: 1,
  currentXP: 0,
  totalXP: 0,
  state: 'neutral',
  purchasedAt: new Date().toISOString(),
  isActive: true,
};

interface CatStore {
  user: UserProfile;
  cats: Cat[];
  activeCatId: string;
  coins: number;
  streak: number;
  lastStreakDate: string | null; // yyyy-MM-dd of last streak increment
  totalMedsTaken: number;
  happiness: number;
  nameTags: number;
  isLoading: boolean;
  lastLevelUp: { oldLevel: number; newLevel: number; bonusCoins: number } | null;

  // Computed helpers
  getActiveCat: () => Cat;

  // User actions
  setUserName: (name: string) => void;
  completeOnboarding: () => Promise<void>;
  loadOnboardingState: () => Promise<boolean>;
  setPreference: (key: keyof Preferences, value: any) => void;

  // Cat actions
  purchaseCat: (catId: string, breed: CatBreed, name: string, price: number) => boolean;
  setActiveCat: (catId: string) => void;
  renameCat: (catId: string, newName: string) => boolean;

  // Progress actions
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
  incrementMedsTaken: () => void;
  setCatState: (state: CatState) => void;

  // Clear/reset
  clearLevelUp: () => void;
  resetCatProgress: () => void;
  clearAllData: () => Promise<void>;
  resetOnboarding: () => Promise<void>;

  // Legacy compatibility
  activeCatLegacy: {
    name: string;
    happiness: number;
    hunger: number;
    level: number;
    xp: number;
    coins: number;
    streak: number;
    mood: CatMood;
    totalMedsTaken: number;
    inventory: string[];
    equippedItems: string[];
  };
  feedCat: () => void;
  purchaseItem: (itemId: string, price: number) => boolean;
  equipItem: (itemId: string) => void;
}

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useCatStore = create<CatStore>()(
  persist(
    (set, get) => ({
  user: {
    name: '',
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    preferences: {
      notificationsEnabled: true,
      soundEnabled: true,
      hapticEnabled: true,
      reminderMinutesBefore: 5,
    },
  },
  cats: [{ ...DEFAULT_CAT }],
  activeCatId: 'cat_starter',
  coins: 0,
  streak: 0,
  lastStreakDate: null,
  totalMedsTaken: 0,
  happiness: 80,
  nameTags: 3,
  isLoading: true,
  lastLevelUp: null,

  // Computed: legacy cat object for backward compatibility
  get activeCatLegacy() {
    const state = get();
    const activeCat = state.cats.find((c) => c.id === state.activeCatId) ?? state.cats[0] ?? DEFAULT_CAT;
    return {
      name: activeCat.name,
      happiness: state.happiness,
      hunger: 50,
      level: activeCat.level,
      xp: activeCat.currentXP,
      coins: state.coins,
      streak: state.streak,
      mood: activeCat.state as CatMood,
      totalMedsTaken: state.totalMedsTaken,
      inventory: state.cats.map((c) => c.id),
      equippedItems: [],
    };
  },

  getActiveCat: () => {
    const state = get();
    return state.cats.find((c) => c.id === state.activeCatId) ?? state.cats[0] ?? DEFAULT_CAT;
  },

  // User actions
  setUserName: (name: string) => {
    set((state) => ({
      user: { ...state.user, name },
    }));
    AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify({ name }));
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set((state) => ({
      user: { ...state.user, onboardingComplete: true },
    }));
  },

  loadOnboardingState: async () => {
    try {
      const [onboardingValue, profileValue] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(USER_PROFILE_KEY),
      ]);

      const onboardingComplete = onboardingValue === 'true';
      const profile = profileValue ? JSON.parse(profileValue) : {};

      set((state) => ({
        user: {
          ...state.user,
          name: profile.name || '',
          onboardingComplete,
        },
        isLoading: false,
      }));

      return onboardingComplete;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  setPreference: (key, value) => {
    set((state) => ({
      user: {
        ...state.user,
        preferences: { ...state.user.preferences, [key]: value },
      },
    }));
  },

  // Cat actions
  purchaseCat: (catId, breed, name, price) => {
    const state = get();
    if (state.coins < price) return false;
    if (state.cats.some((c) => c.id === catId)) return false;

    const newCat: Cat = {
      id: catId,
      breed,
      name,
      level: 1,
      currentXP: 0,
      totalXP: 0,
      state: 'happy',
      purchasedAt: new Date().toISOString(),
      isActive: false,
    };

    set((s) => ({
      cats: [...s.cats, newCat],
      coins: s.coins - price,
    }));
    return true;
  },

  setActiveCat: (catId) => {
    set((state) => ({
      activeCatId: catId,
      cats: state.cats.map((c) => ({
        ...c,
        isActive: c.id === catId,
      })),
    }));
  },

  renameCat: (catId, newName) => {
    const state = get();
    // Premium users get unlimited renames; check via premiumStore
    const { usePremiumStore } = require('./premiumStore');
    const isPremium = usePremiumStore.getState().isPremium;

    if (!isPremium && state.nameTags <= 0) return false;

    set((s) => ({
      cats: s.cats.map((c) => (c.id === catId ? { ...c, name: newName } : c)),
      nameTags: isPremium ? s.nameTags : s.nameTags - 1,
    }));
    return true;
  },

  // Progress actions
  addXp: (amount) => {
    set((state) => {
      const activeCat = state.cats.find((c) => c.id === state.activeCatId);
      if (!activeCat) return {};

      const newXP = activeCat.currentXP + amount;
      const xpToLevel = activeCat.level * 100;
      const shouldLevelUp = newXP >= xpToLevel;
      const newLevel = shouldLevelUp ? activeCat.level + 1 : activeCat.level;
      const bonusCoins = shouldLevelUp ? newLevel * 10 : 0;
      // Award a name tag every 5 levels
      const earnedNameTag = shouldLevelUp && newLevel % 5 === 0;

      return {
        cats: state.cats.map((c) =>
          c.id === state.activeCatId
            ? {
                ...c,
                currentXP: shouldLevelUp ? newXP - xpToLevel : newXP,
                totalXP: c.totalXP + amount,
                level: newLevel,
                state: shouldLevelUp ? ('excited' as CatState) : c.state,
              }
            : c
        ),
        coins: state.coins + bonusCoins,
        happiness: Math.min(100, state.happiness + 5),
        nameTags: earnedNameTag ? state.nameTags + 1 : state.nameTags,
        lastLevelUp: shouldLevelUp
          ? { oldLevel: activeCat.level, newLevel, bonusCoins }
          : state.lastLevelUp,
      };
    });
  },

  addCoins: (amount) => {
    set((state) => ({ coins: state.coins + amount }));
  },

  incrementStreak: () => {
    const today = getTodayKey();
    const lastDate = get().lastStreakDate;
    // Only increment once per day
    if (lastDate === today) return;
    // If last streak was yesterday, continue streak; otherwise reset to 1
    const yesterday = getYesterdayKey();
    const newStreak = lastDate === yesterday ? get().streak + 1 : 1;
    set({ streak: newStreak, lastStreakDate: today });
  },

  incrementMedsTaken: () => {
    set((state) => ({ totalMedsTaken: state.totalMedsTaken + 1 }));
  },

  setCatState: (catState) => {
    set((state) => ({
      cats: state.cats.map((c) =>
        c.id === state.activeCatId ? { ...c, state: catState } : c
      ),
    }));
  },

  // Clear/reset
  clearLevelUp: () => {
    set({ lastLevelUp: null });
  },

  resetCatProgress: () => {
    set({
      cats: [{ ...DEFAULT_CAT, purchasedAt: new Date().toISOString() }],
      activeCatId: 'cat_starter',
      coins: 0,
      streak: 0,
      lastStreakDate: null,
      happiness: 80,
      totalMedsTaken: 0,
      nameTags: 3,
      lastLevelUp: null,
    });
  },

  clearAllData: async () => {
    await AsyncStorage.multiRemove([ONBOARDING_KEY, USER_PROFILE_KEY, CATS_KEY, 'kawaii-meds-cats', 'kawaii-meds-medications']);
    set({
      user: {
        name: '',
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        preferences: {
          notificationsEnabled: true,
          soundEnabled: true,
          hapticEnabled: true,
          reminderMinutesBefore: 5,
        },
      },
      cats: [{ ...DEFAULT_CAT, purchasedAt: new Date().toISOString() }],
      activeCatId: 'cat_starter',
      coins: 0,
      streak: 0,
      lastStreakDate: null,
      happiness: 80,
      totalMedsTaken: 0,
      nameTags: 3,
      lastLevelUp: null,
    });
  },

  resetOnboarding: async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    set((state) => ({
      user: { ...state.user, onboardingComplete: false },
    }));
  },

  // Legacy compatibility stubs
  feedCat: () => {
    set((state) => ({
      happiness: Math.min(100, state.happiness + 10),
    }));
  },

  purchaseItem: (itemId, price) => {
    // Legacy: redirect to purchaseCat if needed
    const state = get();
    if (state.coins < price) return false;
    set((s) => ({ coins: s.coins - price }));
    return true;
  },

  equipItem: () => {},
    }),
    {
      name: 'kawaii-meds-cats',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        cats: state.cats,
        activeCatId: state.activeCatId,
        coins: state.coins,
        streak: state.streak,
        lastStreakDate: state.lastStreakDate,
        totalMedsTaken: state.totalMedsTaken,
        happiness: state.happiness,
        nameTags: state.nameTags,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

