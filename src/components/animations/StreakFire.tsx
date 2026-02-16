import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { StreakFlameIcon } from '../icons/KawaiiIcons';

interface StreakFireProps {
  streak: number;
  size?: number;
}

function getFireScale(streak: number): number {
  if (streak >= 30) return 1.6;
  if (streak >= 14) return 1.4;
  if (streak >= 7) return 1.2;
  if (streak >= 3) return 1.0;
  return 0.8;
}

function getFireCount(streak: number): number {
  if (streak >= 30) return 3;
  if (streak >= 14) return 2;
  return 1;
}

export default function StreakFire({ streak, size = 24 }: StreakFireProps) {
  const flickerScale = useRef(new Animated.Value(1)).current;
  const flickerOpacity = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;

  const fireScale = getFireScale(streak);
  const fireCount = getFireCount(streak);

  useEffect(() => {
    if (streak <= 0) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(flickerScale, { toValue: 1.1, duration: 200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flickerScale, { toValue: 0.95, duration: 150, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flickerScale, { toValue: 1.05, duration: 180, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flickerScale, { toValue: 1, duration: 170, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(flickerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(flickerOpacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
        Animated.timing(flickerOpacity, { toValue: 0.9, duration: 250, useNativeDriver: true }),
        Animated.timing(flickerOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ])
    ).start();

    if (streak >= 7) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.6, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.2, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }

    if (streak >= 3) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(wobble, { toValue: 3, duration: 300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(wobble, { toValue: -3, duration: 300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(wobble, { toValue: 2, duration: 250, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(wobble, { toValue: 0, duration: 250, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [streak]);

  const wobbleDeg = wobble.interpolate({ inputRange: [-3, 3], outputRange: ['-3deg', '3deg'] });

  if (streak <= 0) {
    return (
      <View style={styles.container}>
        <StreakFlameIcon size={size * 0.8} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {streak >= 7 && (
        <Animated.View style={[styles.glow, { width: size * 2, height: size * 2, borderRadius: size, opacity: glowOpacity }]} />
      )}
      <Animated.View style={{ opacity: flickerOpacity, flexDirection: 'row', transform: [{ scale: Animated.multiply(flickerScale, fireScale) }, { rotate: wobbleDeg }] }}>
        {Array.from({ length: fireCount }).map((_, i) => (
          <StreakFlameIcon key={i} size={size} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', backgroundColor: 'rgba(244,162,97,0.25)' },
});
