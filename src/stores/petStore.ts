import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@kawaii_meds_onboarding_complete';
const USER_PROFILE_KEY = '@kawaii_meds_user_profile';

export type CatMood = 'happy' | 'neutral' | 'sleepy' | 'excited';

export interface PetState {
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
}

export interface Preferences {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reminderMinutesBefore: number;
}

export interface UserProfile {
  name: string;
  onboardingComplete: boolean;
  createdAt: string;
  preferences: Preferences;
}

interface PetStore {
  pet: PetState;
  user: UserProfile;
  isLoading: boolean;
  lastLevelUp: { oldLevel: number; newLevel: number; bonusCoins: number } | null;

  setUserName: (name: string) => void;
  completeOnboarding: () => Promise<void>;
  loadOnboardingState: () => Promise<boolean>;
  feedPet: () => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
  incrementMedsTaken: () => void;
  setCatMood: (mood: CatMood) => void;
  renameCat: (name: string) => void;
  purchaseItem: (itemId: string, price: number) => boolean;
  equipItem: (itemId: string) => void;
  setPreference: (key: keyof Preferences, value: any) => void;
  clearLevelUp: () => void;
  resetCatProgress: () => void;
  clearAllData: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pet: {
    name: 'Snowball',
    happiness: 80,
    hunger: 50,
    level: 1,
    xp: 0,
    coins: 0,
    streak: 0,
    mood: 'happy' as CatMood,
    totalMedsTaken: 0,
    inventory: [],
    equippedItems: [],
  },
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
  isLoading: true,
  lastLevelUp: null,

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

  feedPet: () => {
    set((state) => ({
      pet: {
        ...state.pet,
        hunger: Math.max(0, state.pet.hunger - 20),
        happiness: Math.min(100, state.pet.happiness + 10),
      },
    }));
  },

  addXp: (amount: number) => {
    set((state) => {
      const newXp = state.pet.xp + amount;
      const xpToLevel = state.pet.level * 100;
      const shouldLevelUp = newXp >= xpToLevel;
      const newLevel = shouldLevelUp ? state.pet.level + 1 : state.pet.level;
      const bonusCoins = shouldLevelUp ? newLevel * 10 : 0;

      return {
        pet: {
          ...state.pet,
          xp: shouldLevelUp ? newXp - xpToLevel : newXp,
          level: newLevel,
          happiness: Math.min(100, state.pet.happiness + 5),
          coins: state.pet.coins + bonusCoins,
          mood: shouldLevelUp ? 'excited' as CatMood : state.pet.mood,
        },
        lastLevelUp: shouldLevelUp
          ? { oldLevel: state.pet.level, newLevel, bonusCoins }
          : state.lastLevelUp,
      };
    });
  },

  addCoins: (amount: number) => {
    set((state) => ({
      pet: {
        ...state.pet,
        coins: state.pet.coins + amount,
      },
    }));
  },

  incrementStreak: () => {
    set((state) => ({
      pet: {
        ...state.pet,
        streak: state.pet.streak + 1,
      },
    }));
  },

  incrementMedsTaken: () => {
    set((state) => ({
      pet: {
        ...state.pet,
        totalMedsTaken: state.pet.totalMedsTaken + 1,
      },
    }));
  },

  setCatMood: (mood: CatMood) => {
    set((state) => ({
      pet: { ...state.pet, mood },
    }));
  },

  renameCat: (name: string) => {
    set((state) => ({
      pet: { ...state.pet, name },
    }));
  },

  purchaseItem: (itemId: string, price: number) => {
    const { pet } = get();
    if (pet.coins < price || pet.inventory.includes(itemId)) return false;
    set((state) => ({
      pet: {
        ...state.pet,
        coins: state.pet.coins - price,
        inventory: [...state.pet.inventory, itemId],
      },
    }));
    return true;
  },

  equipItem: (itemId: string) => {
    set((state) => {
      const equipped = state.pet.equippedItems.includes(itemId)
        ? state.pet.equippedItems.filter((i) => i !== itemId)
        : [...state.pet.equippedItems, itemId];
      return { pet: { ...state.pet, equippedItems: equipped } };
    });
  },

  setPreference: (key, value) => {
    set((state) => ({
      user: {
        ...state.user,
        preferences: { ...state.user.preferences, [key]: value },
      },
    }));
  },

  clearLevelUp: () => {
    set({ lastLevelUp: null });
  },

  resetCatProgress: () => {
    set((state) => ({
      pet: {
        ...state.pet,
        level: 1,
        xp: 0,
        coins: 0,
        streak: 0,
        happiness: 80,
        hunger: 50,
        totalMedsTaken: 0,
        mood: 'happy' as CatMood,
        inventory: [],
        equippedItems: [],
      },
    }));
  },

  clearAllData: async () => {
    await AsyncStorage.multiRemove([ONBOARDING_KEY, USER_PROFILE_KEY]);
    set({
      pet: {
        name: 'Snowball',
        happiness: 80,
        hunger: 50,
        level: 1,
        xp: 0,
        coins: 0,
        streak: 0,
        mood: 'happy' as CatMood,
        totalMedsTaken: 0,
        inventory: [],
        equippedItems: [],
      },
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
      lastLevelUp: null,
    });
  },

  resetOnboarding: async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    set((state) => ({
      user: { ...state.user, onboardingComplete: false },
    }));
  },
}));
