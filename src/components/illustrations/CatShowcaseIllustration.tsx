import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { SparkleIcon, HeartIcon, PawIcon } from '../icons/KawaiiIcons';

const snowballImage = require('../../../assets/images/snowball.webp');
const cloudImage = require('../../../assets/images/cloud.webp');
const cocoaImage = require('../../../assets/images/cocoa.webp');
const mochiImage = require('../../../assets/images/mochi.webp');
const midnightVoidImage = require('../../../assets/images/midnight-void.webp');

const CATS = [
  { image: snowballImage, name: 'Snowball' },
  { image: cloudImage, name: 'Cloud' },
  { image: cocoaImage, name: 'Cocoa' },
  { image: mochiImage, name: 'Mochi' },
  { image: midnightVoidImage, name: 'Midnight' },
];

interface CatShowcaseIllustrationProps {
  width?: number;
  height?: number;
}

export default function CatShowcaseIllustration({
  width = 280,
  height = 220,
}: CatShowcaseIllustrationProps) {
  const centerCat = CATS[0];
  const surroundingCats = CATS.slice(1);

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Surrounding cats in a semi-circle arrangement */}
      {surroundingCats.map((cat, index) => {
        const angle = -60 + index * 40;
        const rad = (angle * Math.PI) / 180;
        const radius = 85;
        const x = Math.sin(rad) * radius;
        const y = -Math.cos(rad) * radius * 0.5 + 10;

        return (
          <View
            key={cat.name}
            style={[
              styles.smallCatContainer,
              {
                transform: [
                  { translateX: x },
                  { translateY: y },
                ],
              },
            ]}
          >
            <Image source={cat.image} style={styles.smallCatImage} resizeMode="contain" />
          </View>
        );
      })}

      {/* Center cat (larger, featured) */}
      <View style={styles.centerCatContainer}>
        <Image source={centerCat.image} style={styles.centerCatImage} resizeMode="contain" />
      </View>

      {/* Sparkle decorations */}
      <View style={[styles.sparkle, { top: 5, left: 20 }]}>
        <SparkleIcon size={16} />
      </View>
      <View style={[styles.sparkle, { top: 10, right: 25 }]}>
        <HeartIcon size={16} color="#FFD4A8" />
      </View>
      <View style={[styles.sparkle, { bottom: 15, left: 15 }]}>
        <PawIcon size={16} />
      </View>
      <View style={[styles.sparkle, { bottom: 10, right: 20 }]}>
        <SparkleIcon size={16} />
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
  centerCatContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    ...Shadows.medium,
  },
  centerCatImage: {
    width: 95,
    height: 95,
    borderRadius: 12,
  },
  smallCatContainer: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...Shadows.small,
  },
  smallCatImage: {
    width: 58,
    height: 58,
    borderRadius: 8,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.35,
    zIndex: 1,
  },
});
