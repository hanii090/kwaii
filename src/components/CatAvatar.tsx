import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { CatMood } from '../stores/catStore';
import { Colors } from '../constants/theme';
import {
  SparkleIcon,
  StarIcon,
  HatIcon,
  SleepIcon,
  HappyCatMoodIcon,
  NeutralCatMoodIcon,
  SleepyCatMoodIcon,
  ExcitedCatMoodIcon,
} from './icons/KawaiiIcons';

interface CatAvatarProps {
  mood: CatMood;
  size?: number;
  equippedItems?: string[];
}

export default function CatAvatar({ mood, size = 160, equippedItems = [] }: CatAvatarProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    bounceAnim.stopAnimation();
    opacityAnim.stopAnimation();

    if (mood === 'happy') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else if (mood === 'excited') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else if (mood === 'sleepy') {
      Animated.timing(bounceAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      Animated.timing(opacityAnim, { toValue: 0.6, duration: 500, useNativeDriver: true }).start();
    } else {
      Animated.timing(bounceAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [mood]);

  const getCatFaceIcon = (faceSize: number) => {
    switch (mood) {
      case 'happy':
        return <HappyCatMoodIcon size={faceSize} />;
      case 'excited':
        return <ExcitedCatMoodIcon size={faceSize} />;
      case 'sleepy':
        return <SleepyCatMoodIcon size={faceSize} />;
      case 'neutral':
      default:
        return <NeutralCatMoodIcon size={faceSize} />;
    }
  };

  const hasHat = equippedItems.some((i) => i.startsWith('hat_'));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY: bounceAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {hasHat && (
        <View style={[styles.hat, { top: -size * 0.08 }]}>
          <HatIcon size={size * 0.25} />
        </View>
      )}
      {getCatFaceIcon(size * 0.55)}

      {mood === 'sleepy' && (
        <View style={styles.zzzContainer}>
          <SleepIcon size={24} />
        </View>
      )}

      {mood === 'excited' && (
        <View style={styles.sparkleContainer}>
          <View style={styles.sparkle}>
            <SparkleIcon size={20} />
          </View>
          <View style={[styles.sparkle, { left: -10, top: -5 }]}>
            <StarIcon size={20} />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  catFace: {
    textAlign: 'center',
  },
  hat: {
    position: 'absolute',
    zIndex: 10,
    textAlign: 'center',
  },
  zzzContainer: {
    position: 'absolute',
    top: 5,
    right: -5,
  },
  zzz: {
    fontSize: 24,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  sparkle: {
    fontSize: 20,
    position: 'absolute',
    right: -5,
    top: 5,
  },
});
