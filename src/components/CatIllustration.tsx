import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import type { CatBreed, CatState } from '../types';

const snowballImage = require('../../assets/images/snowball.webp');
const cloudImage = require('../../assets/images/cloud.webp');
const cocoaImage = require('../../assets/images/cocoa.webp');
const mochiImage = require('../../assets/images/mochi.webp');
const midnightVoidImage = require('../../assets/images/midnight-void.webp');

const BREED_IMAGES: Partial<Record<CatBreed, ImageSourcePropType>> = {
  basic: snowballImage,
  cloud: cloudImage,
  cocoa: cocoaImage,
  mochi: mochiImage,
  midnight_void: midnightVoidImage,
};

const BREED_EMOJIS: Record<CatBreed, string> = {
  basic: '🐱',
  cloud: '☁️',
  cocoa: '🍫',
  mochi: '🍡',
  midnight_void: '🌑',
};

interface CatIllustrationProps {
  breed: CatBreed;
  size?: number;
  state?: CatState;
  showBackground?: boolean;
}

export default function CatIllustration({
  breed,
  size = 80,
  state = 'neutral',
  showBackground = true,
}: CatIllustrationProps) {
  const imageSource = BREED_IMAGES[breed];

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.15,
        },
        showBackground && styles.background,
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={{ width: size * 0.85, height: size * 0.85, borderRadius: size * 0.12 }}
          resizeMode="contain"
        />
      ) : (
        <Text style={[styles.emoji, { fontSize: size * 0.5 }]}>{BREED_EMOJIS[breed]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: '#FFF8E1',
  },
  emoji: {
    textAlign: 'center',
  },
});
