import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { CoinIcon } from '../icons/KawaiiIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CoinCollectProps {
  visible: boolean;
  amount?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  onComplete?: () => void;
}

export default function CoinCollect({
  visible,
  amount = 5,
  startX = SCREEN_WIDTH / 2,
  startY = 400,
  endX = SCREEN_WIDTH - 60,
  endY = 50,
  onComplete,
}: CoinCollectProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!visible) {
      scale.setValue(0);
      opacity.setValue(0);
      textOpacity.setValue(0);
      return;
    }

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    translateX.setValue(0);
    translateY.setValue(0);
    rotation.setValue(0);
    textTranslateY.setValue(0);
    textScale.setValue(0.5);

    // Coin scale up then shrink while flying
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 200, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(scale, { toValue: 0.6, duration: 500, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();

    // Opacity
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.delay(700),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    // Fly to target after 300ms
    const flyTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateX, { toValue: deltaX, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: deltaY, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(rotation, { toValue: 1080, duration: 600, easing: Easing.linear, useNativeDriver: true }),
      ]).start();
    }, 300);

    // "+N" text
    Animated.sequence([
      Animated.timing(textOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(textOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.timing(textTranslateY, { toValue: -40, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();

    Animated.sequence([
      Animated.timing(textScale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(textScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    const completeTimeout = setTimeout(() => onComplete?.(), 1100);

    return () => {
      clearTimeout(flyTimeout);
      clearTimeout(completeTimeout);
    };
  }, [visible]);

  const spin = rotation.interpolate({
    inputRange: [0, 1080],
    outputRange: ['0deg', '1080deg'],
  });

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.coin,
          { left: startX - 20, top: startY - 20 },
          { opacity, transform: [{ translateX }, { translateY }, { scale }, { rotateY: spin }] },
        ]}
      >
        <CoinIcon size={32} />
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          { left: startX - 30, top: startY - 30 },
          { opacity: textOpacity, transform: [{ translateY: textTranslateY }, { scale: textScale }] },
        ]}
      >
        <Text style={styles.amountText}>+{amount}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  coin: { position: 'absolute', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  coinEmoji: { fontSize: 32 },
  textContainer: { position: 'absolute', alignItems: 'center' },
  amountText: {
    fontSize: 24, fontWeight: '800', color: '#F4A261',
    textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
});
