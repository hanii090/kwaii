import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import {
  MedPillIcon,
  SparkleIcon,
  StarIcon,
  ClipboardIcon,
  CheckIcon,
  PawIcon,
  HeartIcon,
  NotifBellIcon,
} from './icons/KawaiiIcons';

const { width } = Dimensions.get('window');

const SLIDE_BG_COLORS = [
  '#FFF5E6', // warm cream
  '#E8F5E9', // soft mint
  '#FFF0EB', // soft peach
  '#EDE7F6', // soft lavender
];

type IconType = 'pill' | 'sparkle' | 'star' | 'clipboard' | 'check' | 'paw' | 'heart' | 'bell';

const FLOATING_DECORATIONS: Record<string, { icon: IconType; top: number; left: number; size: number; opacity: number }[]> = {
  '1': [
    { icon: 'pill', top: 15, left: 10, size: 22, opacity: 0.25 },
    { icon: 'star', top: 60, left: 85, size: 18, opacity: 0.2 },
    { icon: 'sparkle', top: 40, left: 5, size: 16, opacity: 0.3 },
    { icon: 'star', top: 10, left: 75, size: 14, opacity: 0.2 },
  ],
  '2': [
    { icon: 'clipboard', top: 12, left: 80, size: 20, opacity: 0.25 },
    { icon: 'check', top: 55, left: 8, size: 18, opacity: 0.2 },
    { icon: 'pill', top: 35, left: 88, size: 16, opacity: 0.2 },
    { icon: 'sparkle', top: 8, left: 15, size: 18, opacity: 0.25 },
  ],
  '3': [
    { icon: 'paw', top: 15, left: 8, size: 20, opacity: 0.25 },
    { icon: 'heart', top: 50, left: 85, size: 18, opacity: 0.2 },
    { icon: 'sparkle', top: 10, left: 82, size: 16, opacity: 0.25 },
    { icon: 'star', top: 58, left: 6, size: 16, opacity: 0.2 },
  ],
  '4': [
    { icon: 'bell', top: 12, left: 10, size: 22, opacity: 0.25 },
    { icon: 'pill', top: 55, left: 88, size: 18, opacity: 0.2 },
    { icon: 'sparkle', top: 8, left: 80, size: 16, opacity: 0.2 },
    { icon: 'paw', top: 50, left: 5, size: 18, opacity: 0.25 },
  ],
};

const ICON_MAP: Record<IconType, React.ComponentType<{ size?: number; color?: string }>> = {
  pill: MedPillIcon,
  sparkle: SparkleIcon,
  star: StarIcon,
  clipboard: ClipboardIcon,
  check: CheckIcon,
  paw: PawIcon,
  heart: HeartIcon,
  bell: NotifBellIcon,
};

export interface SlideData {
  id: string;
  Illustration: React.ComponentType<any>;
  title: string;
  description: string;
  subtitle?: string;
}

interface OnboardingSlideProps {
  item: SlideData;
  currentIndex: number;
  totalSlides: number;
}

export default function OnboardingSlide({
  item,
  currentIndex,
  totalSlides,
}: OnboardingSlideProps) {
  const { height } = useWindowDimensions();
  const { Illustration } = item;
  const bgColor = SLIDE_BG_COLORS[currentIndex % SLIDE_BG_COLORS.length];
  const decorations = FLOATING_DECORATIONS[item.id] || [];

  return (
    <View style={[styles.container, { width }]}>
      {/* Colored illustration area */}
      <View style={[styles.illustrationArea, { height: height * 0.48, backgroundColor: bgColor }]}>
        {/* Soft blob shape behind illustration */}
        <View style={styles.blobOuter}>
          <View style={[styles.blobInner, { backgroundColor: Colors.background }]} />
        </View>

        {/* Floating decorations */}
        {decorations.map((dec, i) => {
          const IconComp = ICON_MAP[dec.icon];
          return (
            <View
              key={i}
              style={[
                styles.floatingDecor,
                {
                  top: `${dec.top}%`,
                  left: `${dec.left}%`,
                  opacity: dec.opacity,
                },
              ]}
            >
              <IconComp size={dec.size} />
            </View>
          );
        })}

        <View style={styles.illustrationContainer}>
          <Illustration width={220} height={220} />
        </View>
      </View>

      {/* Text content area */}
      <View style={styles.textArea}>
        {item.subtitle && (
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        )}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  illustrationArea: {
    width: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  blobOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.5,
  },
  floatingDecor: {
    position: 'absolute',
  },
  illustrationContainer: {
    zIndex: 2,
  },
  textArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl + 8,
    paddingTop: Spacing.lg,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warm,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.sm,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: BorderRadius.full,
  },
  activeDot: {
    backgroundColor: Colors.warm,
    width: 28,
  },
  inactiveDot: {
    backgroundColor: Colors.inactive,
    width: 8,
  },
});
