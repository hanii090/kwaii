import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface CatJumpProps {
  visible: boolean;
  onComplete?: () => void;
  size?: number;
  loops?: number;
}

export default function CatJump({ visible, onComplete, size = 120, loops = 3 }: CatJumpProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const pawRotate = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      translateY.setValue(0);
      scaleX.setValue(1);
      scaleY.setValue(1);
      pawRotate.setValue(0);
      heartOpacity.setValue(0);
      return;
    }

    const bounce = Animated.sequence([
      Animated.timing(translateY, { toValue: 5, duration: 100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(translateY, { toValue: -40, damping: 6, stiffness: 200, mass: 0.5, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 5, duration: 150, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 8, stiffness: 150, mass: 0.5, useNativeDriver: true }),
    ]);

    const squashX = Animated.sequence([
      Animated.timing(scaleX, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleX, { toValue: 0.9, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleX, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleX, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }),
    ]);

    const squashY = Animated.sequence([
      Animated.timing(scaleY, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleY, { toValue: 1.15, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleY, { toValue: 0.9, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleY, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }),
    ]);

    const paw = Animated.sequence([
      Animated.delay(200),
      Animated.timing(pawRotate, { toValue: 15, duration: 150, useNativeDriver: true }),
      Animated.timing(pawRotate, { toValue: -15, duration: 150, useNativeDriver: true }),
      Animated.timing(pawRotate, { toValue: 10, duration: 150, useNativeDriver: true }),
      Animated.timing(pawRotate, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]);

    const oneLoop = Animated.parallel([bounce, squashX, squashY, paw]);

    const allLoops: Animated.CompositeAnimation[] = [];
    for (let i = 0; i < loops; i++) allLoops.push(oneLoop);

    Animated.sequence([
      ...allLoops,
    ]).start(() => onComplete?.());

    // Heart
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(heartOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(heartOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const pawSpin = pawRotate.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  if (!visible) return null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.heart, { opacity: heartOpacity }]}>
        <Text style={styles.heartText}>💕</Text>
      </Animated.View>

      <Animated.View style={[styles.catBody, { transform: [{ translateY }, { scaleX }, { scaleY }] }]}>
        <Animated.View style={[styles.paw, { transform: [{ rotate: pawSpin }] }]}>
          <Text style={{ fontSize: size * 0.15 }}>🐾</Text>
        </Animated.View>
        <Text style={[styles.catFace, { fontSize: size * 0.55 }]}>😸</Text>
      </Animated.View>

      <Text style={[styles.sparkle, styles.sparkleLeft]}>✨</Text>
      <Text style={[styles.sparkle, styles.sparkleRight]}>⭐</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  catBody: { alignItems: 'center', justifyContent: 'center' },
  catFace: { textAlign: 'center' },
  paw: { position: 'absolute', top: -5, right: -10, zIndex: 10 },
  heart: { position: 'absolute', top: -15, zIndex: 10 },
  heartText: { fontSize: 20 },
  sparkle: { position: 'absolute', fontSize: 16 },
  sparkleLeft: { left: 0, top: 10 },
  sparkleRight: { right: 0, bottom: 10 },
});
