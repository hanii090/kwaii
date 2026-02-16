import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface StaggeredEntryOptions {
  count: number;
  delay?: number;
  stagger?: number;
  duration?: number;
  translateY?: number;
}

export function useStaggeredEntry({
  count,
  delay = 0,
  stagger = 80,
  duration = 450,
  translateY = 20,
}: StaggeredEntryOptions) {
  const anims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration,
        delay: delay + i * stagger,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      })
    );
    Animated.stagger(stagger, animations).start();
  }, []);

  return anims.map((anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [translateY, 0],
        }),
      },
    ],
  }));
}
