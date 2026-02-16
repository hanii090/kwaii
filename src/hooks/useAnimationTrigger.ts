import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useAnimationStore } from '../stores/animationStore';

export function useAnimationTrigger() {
  const {
    triggerMedicationTaken,
    triggerCatPurchase,
    completeAnimation,
    clearAll,
    clearLevelUp,
    clearToast,
    activeAnimations,
    isPlaying,
    levelUpData,
    coinAmount,
    xpData,
    toastMessage,
  } = useAnimationStore();

  const onMedicationTaken = useCallback(
    (data: {
      coinAmount: number;
      xpCurrent: number;
      xpMax: number;
      level: number;
      leveledUp: boolean;
      newLevel?: number;
      bonusCoins?: number;
    }) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      triggerMedicationTaken(data);
    },
    [triggerMedicationTaken]
  );

  const onCatPurchased = useCallback(
    (catName: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      triggerCatPurchase(catName);
    },
    [triggerCatPurchase]
  );

  const onAnimationComplete = useCallback(
    (type: Parameters<typeof completeAnimation>[0]) => {
      completeAnimation(type);
    },
    [completeAnimation]
  );

  const isAnimationActive = useCallback(
    (type: string) => activeAnimations.includes(type as any),
    [activeAnimations]
  );

  return {
    onMedicationTaken,
    onCatPurchased,
    onAnimationComplete,
    isAnimationActive,
    clearAll,
    clearLevelUp,
    clearToast,
    isPlaying,
    levelUpData,
    coinAmount,
    xpData,
    toastMessage,
    activeAnimations,
  };
}
