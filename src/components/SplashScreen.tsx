import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

function KawaiiPawIcon({ size = 32, color = '#5C3D2E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="15.5" rx="5.5" ry="4.5" fill={color} />
      <Circle cx="7.5" cy="9.5" r="2.5" fill={color} />
      <Circle cx="12" cy="7.5" r="2.5" fill={color} />
      <Circle cx="16.5" cy="9.5" r="2.5" fill={color} />
    </Svg>
  );
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const pawOpacity = useRef(new Animated.Value(0)).current;
  const pawScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(20)).current;
  const dotScale = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(12)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const containerScale = useRef(new Animated.Value(1)).current;

  // Keep latest onFinish in a ref so the timeout always calls the current one
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // Use simple setTimeout chain — immune to remounts / sequence stalls

    // Step 1: Paw fades in immediately
    Animated.parallel([
      Animated.timing(pawOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(pawScale, { toValue: 1, duration: 350, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
    ]).start();

    // Step 2: Logo slides up at 400ms
    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(logoTranslateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }, 400);

    // Step 3: Dot pops in at 700ms
    const t2 = setTimeout(() => {
      Animated.timing(dotScale, { toValue: 1, duration: 300, easing: Easing.out(Easing.back(2)), useNativeDriver: true }).start();
    }, 700);

    // Step 4: Tagline fades in at 900ms
    const t3 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(taglineTranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }, 900);

    // Step 5: Exit fade at 1800ms
    const t4 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(containerOpacity, { toValue: 0, duration: 350, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(containerScale, { toValue: 1.04, duration: 350, useNativeDriver: true }),
      ]).start();
    }, 1800);

    // Step 6: Fire onFinish at 2200ms
    const t5 = setTimeout(() => {
      onFinishRef.current?.();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ scale: containerScale }],
        },
      ]}
    >
      {/* Gradient-like layered background */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Content */}
      <View style={styles.content}>
        {/* Paw icon */}
        <Animated.View
          style={[
            styles.pawContainer,
            {
              opacity: pawOpacity,
              transform: [{ scale: pawScale }],
            },
          ]}
        >
          <KawaiiPawIcon size={40} color="#5C3D2E" />
        </Animated.View>

        {/* App name */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
            flexDirection: 'row',
            alignItems: 'baseline',
          }}
        >
          <Text style={styles.logoText}>Kawaii</Text>
          <Animated.View style={{ transform: [{ scale: dotScale }] }}>
            <Text style={styles.logoDot}>.</Text>
          </Animated.View>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={{
            opacity: taglineOpacity,
            transform: [{ translateY: taglineTranslateY }],
          }}
        >
          <Text style={styles.tagline}>
            <Text style={styles.taglineItalic}>Cute pills</Text>
            <Text>, happy you.</Text>
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.55,
    backgroundColor: '#FCDBA0',
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.55,
    backgroundColor: '#F4A261',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawContainer: {
    marginBottom: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 52,
    fontWeight: '300',
    color: '#3E2723',
    letterSpacing: -1,
  },
  logoDot: {
    fontSize: 52,
    fontWeight: '700',
    color: '#3E2723',
  },
  tagline: {
    fontSize: 18,
    color: '#5C3D2E',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  taglineItalic: {
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
