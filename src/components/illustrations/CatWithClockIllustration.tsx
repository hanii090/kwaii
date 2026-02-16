import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Shadows } from '../../constants/theme';
import { SunIcon, MedPillIcon, SparkleIcon } from '../icons/KawaiiIcons';

const snowballImage = require('../../../assets/images/snowball.webp');

interface Props {
  width?: number;
  height?: number;
}

export default function CatWithClockIllustration({ width = 220, height = 220 }: Props) {
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Clock decoration behind cat */}
      <View style={styles.clockBg}>
        <SunIcon size={30} />
      </View>

      {/* Main cat image */}
      <View style={styles.catContainer}>
        <Image source={snowballImage} style={styles.catImage} resizeMode="contain" />
      </View>

      {/* Floating pills */}
      <View style={[styles.decor, { top: 10, right: 15 }]}>
        <MedPillIcon size={20} />
      </View>
      <View style={[styles.decor, { bottom: 25, left: 10 }]}>
        <MedPillIcon size={20} />
      </View>
      <View style={[styles.decor, { top: 5, left: 25 }]}>
        <SparkleIcon size={18} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clockBg: {
    position: 'absolute',
    top: 10,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  clockEmoji: {
    fontSize: 30,
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
    fontSize: 20,
    opacity: 0.4,
  },
});
