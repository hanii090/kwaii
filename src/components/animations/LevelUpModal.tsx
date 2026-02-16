import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Star {
  x: number;
  y: number;
  delay: number;
  size: number;
  emoji: string;
}

function generateStars(count: number): Star[] {
  const emojis = ['⭐', '✨', '🌟', '💫', '🎉', '🎊'];
  return Array.from({ length: count }, () => ({
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT * 0.6,
    delay: Math.random() * 1500,
    size: 16 + Math.random() * 20,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
  }));
}

function AnimatedStar({ star }: { star: Star }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.spring(scale, { toValue: 1.2, damping: 4, stiffness: 100, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 0.8, damping: 4, stiffness: 100, useNativeDriver: true }),
        ])
      ).start();
    }, star.delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={{ position: 'absolute', left: star.x, top: star.y, opacity, transform: [{ scale }] }}>
      <Text style={{ fontSize: star.size }}>{star.emoji}</Text>
    </Animated.View>
  );
}

interface LevelUpModalProps {
  visible: boolean;
  oldLevel: number;
  newLevel: number;
  bonusCoins: number;
  onClose: () => void;
}

export default function LevelUpModal({ visible, oldLevel, newLevel, bonusCoins, onClose }: LevelUpModalProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const levelScale = useRef(new Animated.Value(0)).current;
  const coinsOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const [stars] = useState(() => generateStars(15));

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

      setTimeout(() => {
        Animated.spring(cardScale, { toValue: 1, damping: 8, stiffness: 120, useNativeDriver: true }).start();
        Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      }, 200);

      setTimeout(() => {
        Animated.sequence([
          Animated.spring(levelScale, { toValue: 1.3, damping: 4, stiffness: 150, useNativeDriver: true }),
          Animated.spring(levelScale, { toValue: 1, damping: 6, stiffness: 150, useNativeDriver: true }),
        ]).start();
      }, 500);

      setTimeout(() => {
        Animated.timing(coinsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      }, 800);

      setTimeout(() => {
        Animated.timing(buttonOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      }, 1100);
    } else {
      overlayOpacity.setValue(0);
      cardScale.setValue(0.5);
      cardOpacity.setValue(0);
      levelScale.setValue(0);
      coinsOpacity.setValue(0);
      buttonOpacity.setValue(0);
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [onClose]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {stars.map((star, i) => (
          <AnimatedStar key={i} star={star} />
        ))}

        <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.levelUpText}>Level Up!</Text>

          <Animated.View style={{ transform: [{ scale: levelScale }] }}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{newLevel}</Text>
            </View>
          </Animated.View>

          <Text style={styles.levelSubtext}>Level {oldLevel} → Level {newLevel}</Text>

          <Animated.View style={[styles.coinsRow, { opacity: coinsOpacity }]}>
            <Text style={styles.coinsEmoji}>🪙</Text>
            <Text style={styles.coinsText}>+{bonusCoins} Bonus Coins!</Text>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
            <TouchableOpacity style={styles.continueButton} onPress={handleClose} activeOpacity={0.8}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  card: {
    width: SCREEN_WIDTH * 0.82, backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl, padding: Spacing.xl, alignItems: 'center', ...Shadows.large,
  },
  crown: { fontSize: 48, marginBottom: Spacing.sm },
  levelUpText: {
    fontSize: 32, fontWeight: '800', color: Colors.warm, marginBottom: Spacing.md,
    textShadowColor: 'rgba(244,162,97,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  levelBadge: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.warm,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, ...Shadows.medium,
  },
  levelNumber: { fontSize: 36, fontWeight: '800', color: Colors.white },
  levelSubtext: { fontSize: 16, fontWeight: '500', color: Colors.secondary, marginBottom: Spacing.lg },
  coinsRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full, gap: 8, marginBottom: Spacing.lg,
  },
  coinsEmoji: { fontSize: 22 },
  coinsText: { fontSize: 18, fontWeight: '700', color: '#B8860B' },
  buttonContainer: { width: '100%' },
  continueButton: {
    width: '100%', backgroundColor: Colors.warm,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.full, alignItems: 'center',
  },
  continueText: { fontSize: 18, fontWeight: '700', color: Colors.white },
});
