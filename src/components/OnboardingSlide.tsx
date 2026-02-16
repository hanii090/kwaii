import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  Animated,
  Easing,
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

// Animated floating decoration with gentle drift
function FloatingDecor({
  icon,
  top,
  left,
  size,
  opacity,
  index,
}: {
  icon: IconType;
  top: number;
  left: number;
  size: number;
  opacity: number;
  index: number;
}) {
  const driftX = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered fade-in
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      delay: 200 + index * 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Gentle looping drift
    const durationX = 3000 + index * 800;
    const durationY = 3500 + index * 600;
    const rangeX = 6 + index * 2;
    const rangeY = 5 + index * 2;

    Animated.loop(
      Animated.sequence([
        Animated.timing(driftX, { toValue: rangeX, duration: durationX, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(driftX, { toValue: -rangeX, duration: durationX, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(driftY, { toValue: -rangeY, duration: durationY, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(driftY, { toValue: rangeY, duration: durationY, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const IconComp = ICON_MAP[icon];

  return (
    <Animated.View
      style={[
        styles.floatingDecor,
        {
          top: `${top}%`,
          left: `${left}%`,
          opacity: Animated.multiply(fadeIn, new Animated.Value(opacity)),
          transform: [{ translateX: driftX }, { translateY: driftY }],
        },
      ]}
    >
      <IconComp size={size} />
    </Animated.View>
  );
}

// Animated pagination dot
function AnimatedDot({ isActive }: { isActive: boolean }) {
  const widthAnim = useRef(new Animated.Value(isActive ? 28 : 8)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: isActive ? 28 : 8,
      damping: 14,
      stiffness: 200,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: widthAnim,
          backgroundColor: isActive ? Colors.warm : Colors.inactive,
        },
      ]}
    />
  );
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

  // Illustration spring scale-in
  const illustrationScale = useRef(new Animated.Value(0.8)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;

  // Text stagger
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Illustration entrance
    Animated.parallel([
      Animated.spring(illustrationScale, { toValue: 1, damping: 12, stiffness: 120, useNativeDriver: true }),
      Animated.timing(illustrationOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Text stagger: subtitle → title → description
    const baseDelay = 300;
    Animated.timing(subtitleAnim, {
      toValue: 1, duration: 400, delay: baseDelay,
      easing: Easing.out(Easing.back(1.1)), useNativeDriver: true,
    }).start();
    Animated.timing(titleAnim, {
      toValue: 1, duration: 450, delay: baseDelay + 120,
      easing: Easing.out(Easing.back(1.1)), useNativeDriver: true,
    }).start();
    Animated.timing(descAnim, {
      toValue: 1, duration: 400, delay: baseDelay + 260,
      easing: Easing.out(Easing.ease), useNativeDriver: true,
    }).start();
  }, []);

  const textStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{
      translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
    }],
  });

  return (
    <View style={[styles.container, { width }]}>
      {/* Colored illustration area */}
      <View style={[styles.illustrationArea, { height: height * 0.48, backgroundColor: bgColor }]}>
        {/* Soft blob shape behind illustration */}
        <View style={styles.blobOuter}>
          <View style={[styles.blobInner, { backgroundColor: Colors.background }]} />
        </View>

        {/* Animated floating decorations */}
        {decorations.map((dec, i) => (
          <FloatingDecor key={i} index={i} {...dec} />
        ))}

        <Animated.View style={[styles.illustrationContainer, {
          transform: [{ scale: illustrationScale }],
          opacity: illustrationOpacity,
        }]}>
          <Illustration width={220} height={220} />
        </Animated.View>
      </View>

      {/* Text content area */}
      <View style={styles.textArea}>
        {item.subtitle && (
          <Animated.Text style={[styles.subtitle, textStyle(subtitleAnim)]}>
            {item.subtitle}
          </Animated.Text>
        )}
        <Animated.Text style={[styles.title, textStyle(titleAnim)]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[styles.description, textStyle(descAnim)]}>
          {item.description}
        </Animated.Text>
      </View>

      {/* Animated pagination dots */}
      <View style={styles.pagination}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <AnimatedDot key={index} isActive={index === currentIndex} />
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
