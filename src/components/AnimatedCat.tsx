import React, { useEffect, useRef, useCallback } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { CatBreed } from '../types';

const BREED_IMAGES: Partial<Record<CatBreed, ImageSourcePropType>> = {
  basic: require('../../assets/images/snowball.webp'),
  cloud: require('../../assets/images/cloud.webp'),
  cocoa: require('../../assets/images/cocoa.webp'),
  mochi: require('../../assets/images/mochi.webp'),
  midnight_void: require('../../assets/images/midnight-void.webp'),
};

export type CatAnimationType = 'idle' | 'happy' | 'levelup' | 'purchase' | 'tap' | 'none';

export interface AnimatedCatProps {
  breed: CatBreed;
  animationType?: CatAnimationType;
  isPremium: boolean;
  size?: number;
  onAnimationComplete?: () => void;
  enableInteraction?: boolean;
}

export default function AnimatedCat({
  breed,
  animationType = 'idle',
  isPremium = false,
  size = 200,
  onAnimationComplete,
  enableInteraction = true,
}: AnimatedCatProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const activeAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const imageSource = BREED_IMAGES[breed];

  const resetValues = useCallback(() => {
    activeAnimRef.current?.stop();
    activeAnimRef.current = null;
    scale.setValue(1);
    rotation.setValue(0);
    translateY.setValue(0);
    opacity.setValue(1);
  }, [scale, rotation, translateY, opacity]);

  const startIdleAnimation = useCallback(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.02, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );

    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -3, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );

    const combined = Animated.parallel([breathe, float]);
    activeAnimRef.current = combined;
    combined.start();
  }, [scale, translateY]);

  const startHappyAnimation = useCallback(() => {
    const bounceScale = Animated.sequence([
      Animated.spring(scale, { toValue: 1.15, damping: 3, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1.1, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1.05, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1.0, useNativeDriver: true }),
    ]);

    const bounceY = Animated.sequence([
      Animated.spring(translateY, { toValue: -20, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: -15, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: -10, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]);

    const combined = Animated.parallel([bounceScale, bounceY]);
    activeAnimRef.current = combined;
    combined.start(() => onAnimationComplete?.());
  }, [scale, translateY, onAnimationComplete]);

  const startLevelUpAnimation = useCallback(() => {
    const spin = Animated.timing(rotation, { toValue: 360, duration: 1000, useNativeDriver: true });

    const scaleUp = Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 500, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.0, duration: 500, useNativeDriver: true }),
    ]);

    const flash = Animated.sequence([
      Animated.timing(opacity, { toValue: 0.3, duration: 100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1.0, duration: 100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.5, duration: 100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1.0, duration: 100, useNativeDriver: true }),
    ]);

    const combined = Animated.parallel([spin, scaleUp, flash]);
    activeAnimRef.current = combined;
    combined.start(() => {
      rotation.setValue(0);
      onAnimationComplete?.();
    });
  }, [scale, rotation, opacity, onAnimationComplete]);

  const startPurchaseAnimation = useCallback(() => {
    const scaleAnim = Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1.0, useNativeDriver: true }),
    ]);

    const wiggle = Animated.sequence([
      Animated.timing(rotation, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: -3, duration: 100, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 3, duration: 100, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]);

    const combined = Animated.parallel([scaleAnim, wiggle]);
    activeAnimRef.current = combined;
    combined.start(() => onAnimationComplete?.());
  }, [scale, rotation, onAnimationComplete]);

  const startTapAnimation = useCallback(() => {
    const pulse = Animated.sequence([
      Animated.spring(scale, { toValue: 1.1, damping: 8, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1.0, useNativeDriver: true }),
    ]);

    const wiggle = Animated.sequence([
      Animated.timing(rotation, { toValue: -3, duration: 50, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 3, duration: 50, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]);

    const combined = Animated.parallel([pulse, wiggle]);
    combined.start();
  }, [scale, rotation]);

  useEffect(() => {
    if (!isPremium) {
      resetValues();
      return;
    }

    resetValues();

    const timeout = setTimeout(() => {
      switch (animationType) {
        case 'idle':
          startIdleAnimation();
          break;
        case 'happy':
          startHappyAnimation();
          break;
        case 'levelup':
          startLevelUpAnimation();
          break;
        case 'purchase':
          startPurchaseAnimation();
          break;
        case 'tap':
          startTapAnimation();
          break;
        case 'none':
        default:
          break;
      }
    }, 50);

    return () => {
      clearTimeout(timeout);
      activeAnimRef.current?.stop();
    };
  }, [animationType, isPremium]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const handlePress = () => {
    if (enableInteraction && isPremium) {
      startTapAnimation();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const imageSize = size * 0.85;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.container,
          { width: size, height: size },
          isPremium
            ? {
                transform: [
                  { scale },
                  { rotate: rotateInterpolation },
                  { translateY },
                ],
                opacity,
              }
            : undefined,
        ]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize * 0.12,
            }}
            resizeMode="contain"
          />
        ) : null}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
