import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Shadows } from '../../constants/theme';
import { NotifBellIcon, SparkleIcon, MedPillIcon } from '../icons/KawaiiIcons';

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
        <NotifBellIcon size={26} />
      </View>
      <View style={styles.bellBg2}>
        <NotifBellIcon size={20} />
      </View>

      {/* Main cat image */}
      <View style={styles.catContainer}>
        <Image source={midnightVoidImage} style={styles.catImage} resizeMode="contain" />
      </View>

      {/* Sound wave decorations */}
      <View style={[styles.decor, { top: 5, right: 20 }]}>
        <SparkleIcon size={18} color="#B8D8BA" />
      </View>
      <View style={[styles.decor, { bottom: 15, left: 15 }]}>
        <SparkleIcon size={16} />
      </View>
      <View style={[styles.decor, { top: 15, left: 10 }]}>
        <MedPillIcon size={18} />
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
