import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import Confetti from './Confetti';

interface CatPurchaseAnimationProps {
  isVisible: boolean;
  catName: string;
  onComplete: () => void;
}

export default function CatPurchaseAnimation({ isVisible, catName, onComplete }: CatPurchaseAnimationProps) {
  const unlockedOpacity = useRef(new Animated.Value(0)).current;
  const unlockedScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!isVisible) {
      unlockedOpacity.setValue(0);
      unlockedScale.setValue(0.5);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      Animated.sequence([
        Animated.timing(unlockedOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(unlockedOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.spring(unlockedScale, { toValue: 1.2, damping: 6, stiffness: 200, useNativeDriver: true }),
        Animated.spring(unlockedScale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
      ]).start();
    }, 400);

    const timeout = setTimeout(() => onComplete(), 1800);
    return () => clearTimeout(timeout);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Confetti visible={isVisible} />
      <Animated.View style={[styles.unlockedContainer, { opacity: unlockedOpacity, transform: [{ scale: unlockedScale }] }]}>
        <Text style={styles.unlockedText}>Unlocked!</Text>
        <Text style={styles.catNameText}>{catName}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 1001, alignItems: 'center', justifyContent: 'center' },
  unlockedContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 32, paddingVertical: 20, borderRadius: 20,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  unlockedText: { fontSize: 28, fontWeight: '800', color: '#F4A261', marginBottom: 4 },
  catNameText: { fontSize: 18, fontWeight: '600', color: '#8B5E3C' },
});
