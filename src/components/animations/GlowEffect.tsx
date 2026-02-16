import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

interface GlowEffectProps {
  visible: boolean;
  color?: string;
  size?: number;
  intensity?: number;
}

export default function GlowEffect({
  visible,
  color = '#FFD700',
  size = 200,
  intensity = 0.4,
}: GlowEffectProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      const pulseOpacity = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: intensity, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: intensity * 0.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );

      const pulseScale = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.9, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );

      const combined = Animated.parallel([pulseOpacity, pulseScale]);
      animRef.current = combined;
      combined.start();
    } else {
      animRef.current?.stop();
      animRef.current = null;
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      scale.setValue(0.8);
    }

    return () => {
      animRef.current?.stop();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.glow,
        {
          width: size * 1.4,
          height: size * 1.4,
          borderRadius: (size * 1.4) / 2,
          backgroundColor: color,
          marginLeft: -(size * 1.4) / 2,
          marginTop: -(size * 1.4) / 2,
          opacity,
          transform: [{ scale }],
        },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: -1,
  },
});
