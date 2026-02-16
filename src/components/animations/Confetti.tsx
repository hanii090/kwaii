import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Animated, Easing, View } from 'react-native';
import Svg, { Rect, Circle, Polygon } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#FFD4B0', '#D4E7D6', '#B8D8BA', '#F4A261',
  '#FFF5E6', '#E8B4CB', '#B4D4E8', '#F0D4FF',
];

const CONFETTI_COUNT = 30;
const DURATION = 2500;

interface ConfettiPieceData {
  x: number;
  delay: number;
  color: string;
  rotation: number;
  shape: 'rect' | 'circle' | 'triangle';
  size: number;
  speed: number;
}

function generatePieces(): ConfettiPieceData[] {
  return Array.from({ length: CONFETTI_COUNT }, () => ({
    x: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 600,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    shape: (['rect', 'circle', 'triangle'] as const)[Math.floor(Math.random() * 3)],
    size: 6 + Math.random() * 8,
    speed: 0.7 + Math.random() * 0.6,
  }));
}

function ConfettiShape({ shape, size, color }: { shape: string; size: number; color: string }) {
  if (shape === 'circle') {
    return (
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
      </Svg>
    );
  }
  if (shape === 'triangle') {
    const points = `${size / 2},0 ${size},${size} 0,${size}`;
    return (
      <Svg width={size} height={size}>
        <Polygon points={points} fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size * 0.5}>
      <Rect width={size} height={size * 0.5} rx={1} fill={color} />
    </Svg>
  );
}

function ConfettiPiece({ piece }: { piece: ConfettiPieceData }) {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(piece.rotation)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fallDuration = DURATION * piece.speed;
    const dir = Math.random() > 0.5 ? 1 : -1;

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 50,
          duration: fallDuration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: piece.rotation + 720 * dir,
          duration: fallDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(translateX, { toValue: 30, duration: fallDuration / 4, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: -30, duration: fallDuration / 4, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 20, duration: fallDuration / 4, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: -20, duration: fallDuration / 4, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(fallDuration * 0.7),
          Animated.timing(opacity, { toValue: 0, duration: fallDuration * 0.3, useNativeDriver: true }),
        ]),
      ]).start();
    }, piece.delay);

    return () => clearTimeout(timeout);
  }, []);

  const spin = rotate.interpolate({
    inputRange: [piece.rotation, piece.rotation + 720],
    outputRange: [`${piece.rotation}deg`, `${piece.rotation + 720}deg`],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: piece.x,
        top: -20,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: spin }],
      }}
    >
      <ConfettiShape shape={piece.shape} size={piece.size} color={piece.color} />
    </Animated.View>
  );
}

interface ConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function Confetti({ visible, onComplete }: ConfettiProps) {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const [pieces, setPieces] = useState<ConfettiPieceData[]>([]);

  useEffect(() => {
    if (visible) {
      setPieces(generatePieces());
      Animated.timing(containerOpacity, { toValue: 1, duration: 100, useNativeDriver: true }).start();

      const timeout = setTimeout(() => {
        Animated.timing(containerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          onComplete?.();
        });
      }, DURATION);

      return () => clearTimeout(timeout);
    } else {
      containerOpacity.setValue(0);
      setPieces([]);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]} pointerEvents="none">
      {pieces.map((piece, index) => (
        <ConfettiPiece key={index} piece={piece} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});
