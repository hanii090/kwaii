import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Shadows } from '../../constants/theme';

const midnightVoidImage = require('../../../assets/images/midnight-void.webp');

interface Props {
  width?: number;
  height?: number;
}

export default function CatWithBellIllustration({ width = 220, height = 220 }: Props) {
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Bell decorations */}
      <View style={styles.bellBg}>
        <Text style={styles.bellEmoji}>🔔</Text>
      </View>
      <View style={styles.bellBg2}>
        <Text style={styles.bellEmoji2}>🔔</Text>
      </View>

      {/* Main cat image */}
      <View style={styles.catContainer}>
        <Image source={midnightVoidImage} style={styles.catImage} resizeMode="contain" />
      </View>

      {/* Sound wave decorations */}
      <Text style={[styles.decor, { top: 5, right: 20 }]}>🎵</Text>
      <Text style={[styles.decor, { bottom: 15, left: 15 }]}>✨</Text>
      <Text style={[styles.decor, { top: 15, left: 10 }]}>💊</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBg: {
    position: 'absolute',
    top: 10,
    right: 25,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  bellEmoji: {
    fontSize: 26,
  },
  bellBg2: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF0EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  bellEmoji2: {
    fontSize: 20,
  },
  catContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  catImage: {
    width: 130,
    height: 130,
    borderRadius: 16,
  },
  decor: {
    position: 'absolute',
    fontSize: 18,
    opacity: 0.35,
  },
});
