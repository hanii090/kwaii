import { create } from 'zustand';

export type AnimationType =
  | 'confetti'
  | 'catJump'
  | 'coinCollect'
  | 'xpFill'
  | 'levelUp'
  | 'streakFire'
  | 'catPurchase';

export interface AnimationEvent {
  type: AnimationType;
  data?: Record<string, any>;
}

interface AnimationStore {
  activeAnimations: AnimationType[];
  queue: AnimationEvent[];
  isPlaying: boolean;

  // Level up modal state
  levelUpData: { oldLevel: number; newLevel: number; bonusCoins: number } | null;

  // Coin collect data
  coinAmount: number;

  // XP data
  xpData: { current: number; max: number; level: number; leveledUp: boolean } | null;

  // Toast message
  toastMessage: string | null;

  triggerMedicationTaken: (data: {
    coinAmount: number;
    xpCurrent: number;
    xpMax: number;
    level: number;
    leveledUp: boolean;
    newLevel?: number;
    bonusCoins?: number;
  }) => void;

  triggerCatPurchase: (catName: string) => void;

  startAnimation: (type: AnimationType) => void;
  completeAnimation: (type: AnimationType) => void;
  clearAll: () => void;
  clearLevelUp: () => void;
  clearToast: () => void;
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  activeAnimations: [],
  queue: [],
  isPlaying: false,
  levelUpData: null,
  coinAmount: 5,
  xpData: null,
  toastMessage: null,

  triggerMedicationTaken: (data) => {
    set({
      activeAnimations: ['confetti', 'catJump', 'coinCollect', 'xpFill'],
      isPlaying: true,
      coinAmount: data.coinAmount,
      xpData: {
        current: data.xpCurrent,
        max: data.xpMax,
        level: data.level,
        leveledUp: data.leveledUp,
      },
      toastMessage: `✨ +10 XP, +${data.coinAmount} Coins!`,
      levelUpData: data.leveledUp
        ? {
            oldLevel: data.level - 1,
            newLevel: data.newLevel ?? data.level,
            bonusCoins: data.bonusCoins ?? 0,
          }
        : null,
    });
  },

  triggerCatPurchase: (catName) => {
    set({
      activeAnimations: ['confetti', 'catPurchase'],
      isPlaying: true,
      toastMessage: `🎉 ${catName} unlocked!`,
    });
  },

  startAnimation: (type) => {
    set((state) => ({
      activeAnimations: state.activeAnimations.includes(type)
        ? state.activeAnimations
        : [...state.activeAnimations, type],
      isPlaying: true,
    }));
  },

  completeAnimation: (type) => {
    set((state) => {
      const remaining = state.activeAnimations.filter((a) => a !== type);
      return {
        activeAnimations: remaining,
        isPlaying: remaining.length > 0,
      };
    });
  },

  clearAll: () => {
    set({
      activeAnimations: [],
      queue: [],
      isPlaying: false,
      levelUpData: null,
      toastMessage: null,
      xpData: null,
    });
  },

  clearLevelUp: () => {
    set({ levelUpData: null });
  },

  clearToast: () => {
    set({ toastMessage: null });
  },
}));
