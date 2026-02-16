import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../constants/theme';

interface XPBarFillProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLevelUp?: boolean;
  height?: number;
}

export default function XPBarFill({ currentXP, maxXP, level, showLevelUp = false, height = 14 }: XPBarFillProps) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const barScale = useRef(new Animated.Value(1)).current;
  const levelTextScale = useRef(new Animated.Value(1)).current;

  const progress = maxXP > 0 ? Math.min(currentXP / maxXP, 1) : 0;

  useEffect(() => {
    Animated.timing(fillAnim, { toValue: progress, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();

    Animated.sequence([
      Animated.timing(glowOpacity, { toValue: 0.8, duration: 400, useNativeDriver: true }),
      Animated.delay(400),
      Animated.timing(glowOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.timing(barScale, { toValue: 1.02, duration: 150, useNativeDriver: true }),
      Animated.spring(barScale, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }),
    ]).start();

    if (showLevelUp) {
      const sparkleTimeout = setTimeout(() => {
        Animated.sequence([
          Animated.spring(sparkleScale, { toValue: 1.3, damping: 4, stiffness: 150, useNativeDriver: true }),
          Animated.timing(sparkleScale, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();

        Animated.sequence([
          Animated.timing(sparkleOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.delay(600),
          Animated.timing(sparkleOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();

        Animated.sequence([
          Animated.spring(levelTextScale, { toValue: 1.4, damping: 4, stiffness: 200, useNativeDriver: true }),
          Animated.spring(levelTextScale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
        ]).start();
      }, 600);
      return () => clearTimeout(sparkleTimeout);
    }
  }, [progress, showLevelUp]);

  const fillWidth = fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Animated.Text style={[styles.levelLabel, { transform: [{ scale: levelTextScale }] }]}>
          Level {level} → {level + 1}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.trackContainer, { transform: [{ scaleX: barScale }] }]}>
        <View style={[styles.track, { height }]}>
          <Animated.View style={[styles.fill, { height, width: fillWidth }]}>
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
          </Animated.View>
        </View>
      </Animated.View>

      <Text style={styles.xpText}>{currentXP} / {maxXP} XP</Text>

      {showLevelUp && (
        <Animated.View style={[styles.sparkleContainer, { opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>
          <Text style={styles.sparkleText}>✨🎉✨</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  labelRow: { marginBottom: 6 },
  levelLabel: { fontSize: 13, fontWeight: '600', color: Colors.secondary, textAlign: 'center' },
  trackContainer: { width: '100%' },
  track: { width: '100%', backgroundColor: Colors.border, borderRadius: 7, overflow: 'hidden' },
  fill: { borderRadius: 7, backgroundColor: Colors.accent, overflow: 'hidden' },
  glow: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 7 },
  xpText: { fontSize: 12, fontWeight: '500', color: Colors.lightText, marginTop: 4, textAlign: 'center' },
  sparkleContainer: { position: 'absolute', top: -10, alignSelf: 'center' },
  sparkleText: { fontSize: 20 },
});
