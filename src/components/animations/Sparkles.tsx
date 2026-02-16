import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SPARKLE_POSITIONS = [
  { top: -8, left: -5 },
  { top: -12, right: 10 },
  { top: 5, right: -8 },
  { bottom: 10, right: -5 },
  { bottom: -5, left: 15 },
  { top: 10, left: -10 },
];

const SPARKLE_COLORS = ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#DDA0DD', '#F0E68C'];

function StarShape({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={color}
      />
    </Svg>
  );
}

function SparkleParticle({
  position,
  color,
  delay,
  size,
}: {
  position: Record<string, number | undefined>;
  color: string;
  delay: number;
  size: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 600, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.delay(300),
      ])
    );

    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, { toValue: 1, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.3, duration: 600, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.delay(300),
      ])
    );

    const rotateLoop = Animated.loop(
      Animated.timing(rotation, { toValue: 360, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    );

    Animated.parallel([fadeLoop, scaleLoop, rotateLoop]).start();

    return () => {
      fadeLoop.stop();
      scaleLoop.stop();
      rotateLoop.stop();
    };
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.sparkle,
        position,
        {
          opacity,
          transform: [{ scale }, { rotate: spin }],
        },
      ]}
    >
      <StarShape size={size} color={color} />
    </Animated.View>
  );
}

interface SparklesProps {
  visible: boolean;
  count?: number;
}

export default function Sparkles({ visible, count = 6 }: SparklesProps) {
  if (!visible) return null;

  const sparkles = SPARKLE_POSITIONS.slice(0, count);

  return (
    <View style={styles.container} pointerEvents="none">
      {sparkles.map((pos, i) => (
        <SparkleParticle
          key={i}
          position={pos}
          color={SPARKLE_COLORS[i % SPARKLE_COLORS.length]}
          delay={i * 200}
          size={10 + Math.random() * 6}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  sparkle: {
    position: 'absolute',
  },
});
