import React from 'react';
import LevelUpModalAnim from './animations/LevelUpModal';

interface LevelUpModalProps {
  visible: boolean;
  oldLevel: number;
  newLevel: number;
  bonusCoins: number;
  onClose: () => void;
}

export default function LevelUpModal(props: LevelUpModalProps) {
  return <LevelUpModalAnim {...props} />;
}
