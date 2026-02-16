import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';

const PASTEL_COLORS = [
  '#FFD4B0', '#D4E7D6', '#E8B4CB', '#B4D4E8',
  '#F0D4FF', '#FFF5E6', '#B8D8BA', '#F4A261',
];

const PIECE_COUNT = 20;

interface PieceData {
  x: number;
  delay: number;
  color: string;
  shape: 'rect' | 'circle';
  size: number;
  drift: number;
  speed: number;
}

function generatePieces(width: number): PieceData[] {
  return Array.from({ length: PIECE_COUNT }, () => ({
    x: Math.random() * width - width / 2,
    delay: Math.random() * 400,
    color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    size: 4 + Math.random() * 6,
    drift: (Math.random() - 0.5) * 60,
    speed: 0.7 + Math.random() * 0.5,
  }));
}

function ConfettiPiece({ piece, containerHeight }: { piece: PieceData; containerHeight: number }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(piece.x)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fallDistance = containerHeight + 40;
    const duration = 2000 * piece.speed;

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: fallDistance, duration, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateX, { toValue: piece.x + piece.drift, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(rotation, { toValue: 360 + Math.random() * 360, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(duration * 0.6),
          Animated.timing(opacity, { toValue: 0, duration: duration * 0.4, useNativeDriver: true }),
        ]),
      ]).start();
    }, piece.delay);

    return () => clearTimeout(timeout);
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 720],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { rotate: spin }],
        },
      ]}
    >
      <Svg width={piece.size} height={piece.size}>
        {piece.shape === 'circle' ? (
          <Circle cx={piece.size / 2} cy={piece.size / 2} r={piece.size / 2} fill={piece.color} />
        ) : (
          <Rect width={piece.size} height={piece.size * 0.5} rx={1} fill={piece.color} />
        )}
      </Svg>
    </Animated.View>
  );
}

interface CatConfettiProps {
  visible: boolean;
  onComplete?: () => void;
  width?: number;
  height?: number;
}

export default function CatConfetti({
  visible,
  onComplete,
  width = 200,
  height = 200,
}: CatConfettiProps) {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const [pieces, setPieces] = useState<PieceData[]>([]);

  useEffect(() => {
    if (visible) {
      setPieces(generatePieces(width));
      Animated.timing(containerOpacity, { toValue: 1, duration: 100, useNativeDriver: true }).start();

      const timeout = setTimeout(() => {
        Animated.timing(containerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          onComplete?.();
        });
      }, 2200);

      return () => clearTimeout(timeout);
    } else {
      containerOpacity.setValue(0);
      setPieces([]);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height, opacity: containerOpacity },
      ]}
      pointerEvents="none"
    >
      {pieces.map((piece, i) => (
        <ConfettiPiece key={i} piece={piece} containerHeight={height} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 100,
  },
  piece: {
    position: 'absolute',
    top: 0,
  },
});
