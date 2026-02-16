import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Shadows } from '../../constants/theme';

const cocoaImage = require('../../../assets/images/cocoa.webp');

interface Props {
  width?: number;
  height?: number;
}

export default function CatWithListIllustration({ width = 220, height = 220 }: Props) {
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Clipboard decoration */}
      <View style={styles.clipboardBg}>
        <Text style={styles.clipboardEmoji}>📋</Text>
      </View>

      {/* Check decoration */}
      <View style={styles.checkBg}>
        <Text style={styles.checkEmoji}>✅</Text>
      </View>

      {/* Main cat image */}
      <View style={styles.catContainer}>
        <Image source={cocoaImage} style={styles.catImage} resizeMode="contain" />
      </View>

      {/* Decorations */}
      <Text style={[styles.decor, { top: 8, left: 20 }]}>🌿</Text>
      <Text style={[styles.decor, { bottom: 20, right: 15 }]}>✨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clipboardBg: {
    position: 'absolute',
    top: 15,
    left: 25,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  clipboardEmoji: {
    fontSize: 26,
  },
  checkBg: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  checkEmoji: {
    fontSize: 22,
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
