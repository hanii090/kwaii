import React from 'react';
import Confetti from './animations/Confetti';

interface ConfettiOverlayProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function ConfettiOverlay({ visible, onComplete }: ConfettiOverlayProps) {
  return <Confetti visible={visible} onComplete={onComplete} />;
}
