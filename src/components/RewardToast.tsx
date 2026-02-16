import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';

interface RewardToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
}

export default function RewardToast({ visible, message, onHide, duration = 2000 }: RewardToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 60, damping: 12, stiffness: 150, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }),
      ]).start();

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.8, duration: 300, useNativeDriver: true }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      translateY.setValue(-100);
      opacity.setValue(0);
      scale.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }, { scale }] }]}
      pointerEvents="none"
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: Spacing.lg, right: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    alignItems: 'center', zIndex: 998, ...Shadows.large,
  },
  message: { fontSize: 16, fontWeight: '600', color: Colors.primary, textAlign: 'center' },
});
