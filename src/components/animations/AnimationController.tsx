import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAnimationTrigger } from '../../hooks/useAnimationTrigger';
import Confetti from './Confetti';
import CoinCollect from './CoinCollect';
import LevelUpModal from './LevelUpModal';
import RewardToast from '../RewardToast';

interface AnimationControllerProps {
  children: React.ReactNode;
}

export default function AnimationController({ children }: AnimationControllerProps) {
  const {
    isAnimationActive,
    onAnimationComplete,
    levelUpData,
    clearLevelUp,
    coinAmount,
    toastMessage,
    clearToast,
  } = useAnimationTrigger();

  return (
    <View style={styles.container}>
      {children}

      {/* Confetti overlay */}
      <Confetti
        visible={isAnimationActive('confetti')}
        onComplete={() => onAnimationComplete('confetti')}
      />

      {/* Coin collect animation */}
      <CoinCollect
        visible={isAnimationActive('coinCollect')}
        amount={coinAmount}
        onComplete={() => onAnimationComplete('coinCollect')}
      />

      {/* Reward toast */}
      <RewardToast
        visible={!!toastMessage}
        message={toastMessage || ''}
        onHide={clearToast}
      />

      {/* Level up modal */}
      <LevelUpModal
        visible={!!levelUpData}
        oldLevel={levelUpData?.oldLevel ?? 1}
        newLevel={levelUpData?.newLevel ?? 2}
        bonusCoins={levelUpData?.bonusCoins ?? 0}
        onClose={clearLevelUp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
