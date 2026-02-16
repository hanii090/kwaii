import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface ProgressBarProps {
  currentXP: number;
  xpNeeded: number;
  level: number;
  height?: number;
}

export default function ProgressBar({
  currentXP,
  xpNeeded,
  level,
  height = 14,
}: ProgressBarProps) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const progress = xpNeeded > 0 ? Math.min(currentXP / xpNeeded, 1) : 0;

  useEffect(() => {
    Animated.spring(fillAnim, {
      toValue: progress,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Level {level} → {level + 1}
      </Text>
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              height,
            },
          ]}
        />
      </View>
      <Text style={styles.xpText}>
        {currentXP} / {xpNeeded} XP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  track: {
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: 7,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 7,
    backgroundColor: Colors.accent,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.lightText,
    marginTop: 4,
    textAlign: 'center',
  },
});
