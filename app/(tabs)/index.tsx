import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, CalendarDays } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useCatStore } from '../../src/stores/catStore';
import { useMedicationStore } from '../../src/stores/medicationStore';
import { useNotificationStore } from '../../src/stores/notificationStore';
import { NotificationService } from '../../src/services/notificationService';
import { useAnimationTrigger } from '../../src/hooks/useAnimationTrigger';
import MedicationCard from '../../src/components/MedicationCard';

import CatIllustration from '../../src/components/CatIllustration';
import AnimatedCat from '../../src/components/AnimatedCat';
import type { CatAnimationType } from '../../src/components/AnimatedCat';
import Sparkles from '../../src/components/animations/Sparkles';
import GlowEffect from '../../src/components/animations/GlowEffect';
import StreakFire from '../../src/components/animations/StreakFire';
import XPBarFill from '../../src/components/animations/XPBarFill';
import ConfettiOverlay from '@/components/ConfettiOverlay';
import RewardToast from '@/components/RewardToast';
import LevelUpModal from '@/components/LevelUpModal';
import {
  CoinIcon,
  MedPillIcon,
  SunriseIcon,
  SunIcon,
  SunsetIcon,
  MoonIcon,
  CelebrationIcon,
  SparkleIcon,
  StarIcon,
  CrownIcon,
  HeartIcon,
} from '../../src/components/icons/KawaiiIcons';

type TimeOfDay = 'sunrise' | 'sun' | 'sunset' | 'moon';

const GROUP_ICONS: Record<TimeOfDay, React.ComponentType<{ size?: number }>> = {
  sunrise: SunriseIcon,
  sun: SunIcon,
  sunset: SunsetIcon,
  moon: MoonIcon,
};

export default function HomeScreen() {
  const {
    user,
    coins,
    streak,
    getActiveCat,
    addXp,
    addCoins,
    incrementStreak,
    incrementMedsTaken,
    lastLevelUp,
    clearLevelUp,
  } = useCatStore();
  const activeCat = getActiveCat();
  const { medications, markMedicationTaken, removeMedication } = useMedicationStore();
  const { onMedicationTaken } = useAnimationTrigger();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [catAnimation, setCatAnimation] = useState<CatAnimationType>(
    activeCat.breed !== 'basic' ? 'idle' : 'none'
  );
  const isPremiumCat = activeCat.breed !== 'basic';

  // Animated cloud positions
  const cloud1X = useRef(new Animated.Value(0)).current;
  const cloud2X = useRef(new Animated.Value(0)).current;
  const cloud3X = useRef(new Animated.Value(0)).current;
  // Sun pulse
  const sunScale = useRef(new Animated.Value(1)).current;
  const sunGlow = useRef(new Animated.Value(0.4)).current;
  // Tap interaction
  const catBounce = useRef(new Animated.Value(0)).current;
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const heartAnims = useRef<{ opacity: Animated.Value; translateY: Animated.Value }[]>([]);
  const heartIdRef = useRef(0);

  useEffect(() => {
    // Floating clouds
    const animateCloud = (anim: Animated.Value, duration: number, range: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: range, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: -range, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    };
    animateCloud(cloud1X, 6000, 12);
    animateCloud(cloud2X, 8000, 8);
    animateCloud(cloud3X, 7000, 10);

    // Sun pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunScale, { toValue: 1.08, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sunScale, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunGlow, { toValue: 0.7, duration: 2500, useNativeDriver: true }),
        Animated.timing(sunGlow, { toValue: 0.4, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleCardTap = useCallback(() => {
    // Bounce cat
    Animated.sequence([
      Animated.timing(catBounce, { toValue: -12, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(catBounce, { toValue: 0, damping: 6, stiffness: 200, useNativeDriver: true }),
    ]).start();

    // Spawn hearts
    const newHearts = Array.from({ length: 3 }, (_, i) => ({
      id: heartIdRef.current++,
      x: 40 + Math.random() * 60,
      y: 10 + Math.random() * 20,
    }));
    const newAnims = newHearts.map(() => ({
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    }));
    heartAnims.current = [...heartAnims.current, ...newAnims];
    setHearts((prev) => [...prev, ...newHearts]);

    newAnims.forEach((a, i) => {
      Animated.parallel([
        Animated.timing(a.translateY, { toValue: -60, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(a.opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHearts[i].id));
      });
    });

    // Trigger happy animation for premium cats
    if (isPremiumCat && catAnimation === 'idle') {
      setCatAnimation('happy');
      setTimeout(() => setCatAnimation('idle'), 1200);
    }
  }, [isPremiumCat, catAnimation]);

  const LEVEL_ICON_COMPONENTS: React.ComponentType<{ size?: number }>[] = [
    SparkleIcon, SparkleIcon, StarIcon, StarIcon, HeartIcon,
    HeartIcon, StarIcon, StarIcon, CrownIcon, CrownIcon,
  ];
  const LevelIcon = LEVEL_ICON_COMPONENTS[Math.min(activeCat.level - 1, LEVEL_ICON_COMPONENTS.length - 1)];
  const NextLevelIcon = LEVEL_ICON_COMPONENTS[Math.min(activeCat.level, LEVEL_ICON_COMPONENTS.length - 1)];

  // Filter medications by today's day of week
  const DAY_MAP = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  const todaysMeds = useMemo(() => {
    const todayKey = DAY_MAP[new Date().getDay()];
    return medications.filter((m) => !m.days || m.days.length === 0 || m.days.includes(todayKey));
  }, [medications]);

  // Group medications by time period
  const groupedMeds = useMemo(() => {
    const groups: { title: string; icon: TimeOfDay; meds: typeof todaysMeds }[] = [];
    const morning: typeof todaysMeds = [];
    const afternoon: typeof todaysMeds = [];
    const evening: typeof todaysMeds = [];
    const night: typeof todaysMeds = [];

    for (const med of todaysMeds) {
      const firstTime = med.times?.[0];
      if (!firstTime) { morning.push(med); continue; }
      const hour = parseInt(firstTime.split(':')[0], 10);
      if (hour < 12) morning.push(med);
      else if (hour < 17) afternoon.push(med);
      else if (hour < 21) evening.push(med);
      else night.push(med);
    }

    if (morning.length > 0) groups.push({ title: 'Morning', icon: 'sunrise', meds: morning });
    if (afternoon.length > 0) groups.push({ title: 'Afternoon', icon: 'sun', meds: afternoon });
    if (evening.length > 0) groups.push({ title: 'Evening', icon: 'sunset', meds: evening });
    if (night.length > 0) groups.push({ title: 'Night', icon: 'moon', meds: night });

    return groups;
  }, [todaysMeds]);

  const takenCount = todaysMeds.filter((m) => m.taken).length;
  const totalCount = todaysMeds.length;
  const xpNeeded = activeCat.level * 100;

  const handleTakeMedication = useCallback(
    (id: string) => {
      const success = markMedicationTaken(id);
      if (success) {
        incrementMedsTaken();
        addXp(10);
        addCoins(5);

        const cat = getActiveCat();
        const levelUp = useCatStore.getState().lastLevelUp;
        onMedicationTaken({
          coinAmount: 5,
          xpCurrent: cat.currentXP,
          xpMax: cat.level * 100,
          level: cat.level,
          leveledUp: !!levelUp,
          newLevel: levelUp?.newLevel ?? cat.level,
          bonusCoins: levelUp?.bonusCoins ?? 0,
        });

        // Send level-up notification if applicable
        if (levelUp) {
          const notifPrefs = useNotificationStore.getState().preferences;
          if (notifPrefs.masterEnabled && notifPrefs.celebrations) {
            NotificationService.sendLevelUp(
              cat.name,
              levelUp.newLevel,
              levelUp.bonusCoins
            ).catch(() => {});
          }
        }

        // Increment streak when all daily meds are completed
        const updatedMeds = useMedicationStore.getState().medications;
        const dayKey = DAY_MAP[new Date().getDay()];
        const todaysUpdated = updatedMeds.filter((m) => !m.days || m.days.length === 0 || m.days.includes(dayKey));
        const allTaken = todaysUpdated.length > 0 && todaysUpdated.every((m) => m.taken);
        if (allTaken) {
          incrementStreak();
        }

        setToastMessage('+10 XP, +5 Coins!');
        setShowToast(true);
        setShowConfetti(true);

        // Trigger happy animation for premium cats
        if (activeCat.breed !== 'basic') {
          setCatAnimation('happy');
          setTimeout(() => {
            // Check for level up
            const latestLevelUp = useCatStore.getState().lastLevelUp;
            if (latestLevelUp) {
              setCatAnimation('levelup');
              setTimeout(() => setCatAnimation('idle'), 2000);
            } else {
              setCatAnimation('idle');
            }
          }, 1500);
        }
      }
    },
    [markMedicationTaken, addXp, addCoins, incrementStreak, incrementMedsTaken, getActiveCat, onMedicationTaken]
  );

  const handleDeleteMedication = useCallback(
    (id: string) => {
      removeMedication(id);
    },
    [removeMedication]
  );

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ConfettiOverlay
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <RewardToast
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
      />
      <LevelUpModal
        visible={!!lastLevelUp}
        oldLevel={lastLevelUp?.oldLevel ?? 1}
        newLevel={lastLevelUp?.newLevel ?? 2}
        bonusCoins={lastLevelUp?.bonusCoins ?? 0}
        onClose={clearLevelUp}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.streakBadge}>
            <StreakFire streak={streak} size={18} />
            <Text style={styles.streakCount}>{streak}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.calendarBtn}
              onPress={() => router.push('/calendar')}
              activeOpacity={0.7}
            >
              <CalendarDays size={20} color={Colors.primary} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.coinsBadge}>
              <View style={styles.coinIconCircleSm}>
                <CoinIcon size={18} />
              </View>
              <Text style={styles.coinsCount}>{coins}</Text>
            </View>
          </View>
        </View>

        {/* Cat Display Card */}
        <Pressable onPress={handleCardTap} style={styles.catCard}>
          {/* Sky gradient background */}
          <View style={styles.skyGradient}>
            {/* Sun */}
            <Animated.View style={[styles.sun, { transform: [{ scale: sunScale }] }]}>
              <Animated.View style={[styles.sunGlow, { opacity: sunGlow }]} />
              <View style={styles.sunCore} />
            </Animated.View>

            {/* Animated Clouds */}
            <Animated.View style={[styles.cloud, { top: 14, left: 16, transform: [{ translateX: cloud1X }] }]}>
              <View style={styles.cloudPuff} />
              <View style={[styles.cloudPuff, styles.cloudPuffSmall]} />
            </Animated.View>
            <Animated.View style={[styles.cloud, { top: 28, left: '42%', transform: [{ translateX: cloud3X }] }]}>
              <View style={[styles.cloudPuff, { width: 30, height: 14, borderRadius: 7 }]} />
              <View style={[styles.cloudPuff, { width: 20, height: 12, borderRadius: 6, marginLeft: -8, marginTop: 2 }]} />
            </Animated.View>
            <Animated.View style={[styles.cloud, { top: 10, right: 24, transform: [{ translateX: cloud2X }] }]}>
              <View style={styles.cloudPuff} />
              <View style={[styles.cloudPuff, styles.cloudPuffSmall]} />
            </Animated.View>
          </View>

          {/* Hills */}
          <View style={styles.hills}>
            <View style={[styles.hill, styles.hillFar]} />
            <View style={[styles.hill, styles.hillMid]} />
            <View style={[styles.hill, styles.hillNear]} />
          </View>

          {/* Cat name + level badge */}
          <View style={styles.catNameBadge}>
            <Text style={styles.catNameText}>{activeCat.name}</Text>
            <View style={styles.catLevelRow}>
              <LevelIcon size={14} />
              <Text style={styles.catLevelText}>Level {activeCat.level}</Text>
            </View>
          </View>

          {/* Cat illustration with bounce */}
          <Animated.View style={[styles.catIllustrationContainer, { transform: [{ translateY: catBounce }] }]}>
            {isPremiumCat ? (
              <View style={{ position: 'relative' }}>
                <GlowEffect
                  visible={catAnimation === 'levelup'}
                  color="#FFD700"
                  size={120}
                />
                <AnimatedCat
                  breed={activeCat.breed}
                  animationType={catAnimation}
                  isPremium={true}
                  size={120}
                  enableInteraction={true}
                  onAnimationComplete={() => {
                    if (catAnimation === 'happy' || catAnimation === 'levelup') {
                      setCatAnimation('idle');
                    }
                  }}
                />
                <Sparkles visible={catAnimation === 'happy' || catAnimation === 'levelup'} />
              </View>
            ) : (
              <CatIllustration
                breed={activeCat.breed}
                size={120}
                state={activeCat.state}
                showBackground={false}
              />
            )}
            {/* Cat shadow */}
            <View style={styles.catShadow} />
          </Animated.View>

          {/* Floating hearts on tap */}
          {hearts.map((h, i) => {
            const anim = heartAnims.current[heartAnims.current.length - hearts.length + i];
            if (!anim) return null;
            return (
              <Animated.Text
                key={h.id}
                style={[
                  styles.floatingHeart,
                  {
                    left: `${h.x}%`,
                    bottom: 90 + h.y,
                    opacity: anim.opacity,
                    transform: [{ translateY: anim.translateY }],
                  },
                ]}
              >
                <HeartIcon size={16} color="#FFB4A2" />
              </Animated.Text>
            );
          })}

          {/* Grass tufts */}
          <View style={styles.grassContainer}>
            <SparkleIcon size={12} color="#B8D8BA" />
            <SparkleIcon size={10} color="#B8D8BA" />
            <StarIcon size={11} color="#B8D8BA" />
            <SparkleIcon size={12} color="#B8D8BA" />
            <SparkleIcon size={10} color="#B8D8BA" />
          </View>

          {/* XP Bar */}
          <View style={styles.xpBarContainer}>
            <View style={styles.xpLevelRow}>
              <LevelIcon size={14} />
              <Text style={styles.xpLevelLabel}>Level {activeCat.level}</Text>
              <Text style={styles.xpArrow}>→</Text>
              <NextLevelIcon size={14} />
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${xpNeeded > 0 ? Math.min((activeCat.currentXP / xpNeeded) * 100, 100) : 0}%` }]} />
            </View>
            <Text style={styles.xpText}>{activeCat.currentXP} / {xpNeeded} XP</Text>
          </View>
        </Pressable>

        {/* Today's Medicine */}
        <View style={styles.medsSection}>
          <Text style={styles.sectionTitle}>Today's Medicine</Text>
          <Text style={styles.dateSubtitle}>{dateStr}</Text>

          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <MedPillIcon size={28} />
              </View>
              <Text style={styles.emptyTitle}>No medications yet</Text>
              <Text style={styles.emptyText}>
                Add your first medication and we'll sort it under Morning and
                Night for you.
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/add-medication')}
                activeOpacity={0.8}
              >
                <Plus size={18} color={Colors.white} strokeWidth={3} />
                <Text style={styles.addButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </View>
          ) : totalCount === 0 ? (
            <View style={styles.emptyState}>
              <MoonIcon size={28} />
              <Text style={styles.emptyTitle}>No meds scheduled today</Text>
              <Text style={styles.emptyText}>Enjoy your day off!</Text>
            </View>
          ) : (
            <>
              {/* Progress */}
              {totalCount > 0 && (
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressCount}>
                      {takenCount}/{totalCount}
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${
                            totalCount > 0
                              ? (takenCount / totalCount) * 100
                              : 0
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              {/* All done celebration */}
              {takenCount === totalCount && totalCount > 0 && (
                <View style={styles.allDoneCard}>
                  <CelebrationIcon size={28} />
                  <Text style={styles.allDoneTitle}>All done for today!</Text>
                  <Text style={styles.allDoneText}>Great job taking all your medications.</Text>
                </View>
              )}

              {groupedMeds.map((group) => {
                const GroupIcon = GROUP_ICONS[group.icon];
                return (
                  <View key={group.title}>
                    <View style={styles.groupTitleRow}>
                      <GroupIcon size={16} />
                      <Text style={styles.groupTitle}>{group.title}</Text>
                    </View>
                    {group.meds.map((med) => (
                      <MedicationCard
                        key={med.id}
                        medication={med}
                        onTakeMedication={handleTakeMedication}
                        onDeleteMedication={handleDeleteMedication}
                      />
                    ))}
                  </View>
                );
              })}
            </>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
    ...Shadows.small,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  calendarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingRight: Spacing.md,
    paddingLeft: 5,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#FFD54F',
    ...Shadows.small,
  },
  coinIconCircleSm: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinIconEmoji: {
    fontSize: 15,
  },
  coinsCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B8860B',
  },

  // Cat Display Card
  catCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    height: 340,
    position: 'relative' as const,
    backgroundColor: '#C8DD9F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  skyGradient: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: '#A8DBE0',
  },
  sun: {
    position: 'absolute' as const,
    top: 10,
    right: 20,
    width: 44,
    height: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  sunGlow: {
    position: 'absolute' as const,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE082',
  },
  sunCore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD54F',
  },
  cloud: {
    position: 'absolute' as const,
    flexDirection: 'row' as const,
  },
  cloudPuff: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  cloudPuffSmall: {
    width: 28,
    height: 16,
    borderRadius: 8,
    marginLeft: -10,
    marginTop: 4,
  },
  hills: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  hill: {
    position: 'absolute' as const,
    bottom: 0,
    width: '120%' as const,
    height: 110,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },
  hillFar: {
    backgroundColor: '#7EC49A',
    bottom: 70,
    left: -30,
  },
  hillMid: {
    backgroundColor: '#9DD4A0',
    bottom: 35,
    right: -20,
  },
  hillNear: {
    backgroundColor: '#C0D98E',
    bottom: 0,
    left: -10,
  },

  catNameBadge: {
    position: 'absolute' as const,
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  catNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  catLevelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    marginTop: 2,
  },
  catLevelStar: {
    fontSize: 12,
  },
  catLevelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },

  catIllustrationContainer: {
    position: 'absolute' as const,
    bottom: 100,
    alignSelf: 'center' as const,
    zIndex: 5,
    alignItems: 'center' as const,
  },
  catShadow: {
    width: 80,
    height: 12,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignSelf: 'center' as const,
    marginTop: -4,
  },
  floatingHeart: {
    position: 'absolute' as const,
    fontSize: 22,
    zIndex: 20,
  },
  catNameLabel: {
    position: 'absolute' as const,
    bottom: 88,
    alignSelf: 'center' as const,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  catNameLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  grassContainer: {
    position: 'absolute' as const,
    bottom: 68,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    paddingHorizontal: 20,
  },
  grassTuft: {
    fontSize: 16,
  },

  xpBarContainer: {
    position: 'absolute' as const,
    bottom: 10,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  xpLevelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 4,
    marginBottom: 6,
  },
  xpLevelIcon: {
    fontSize: 14,
  },
  xpLevelLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  xpArrow: {
    fontSize: 12,
    color: Colors.lightText,
    fontWeight: '600',
  },
  xpTrack: {
    width: '100%' as const,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 5,
    overflow: 'hidden' as const,
  },
  xpFill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.lightText,
    textAlign: 'center' as const,
    marginTop: 4,
  },

  // Medications Section
  medsSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  dateSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.lightText,
    marginBottom: Spacing.md,
  },

  // Progress
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.small,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFD4B0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyEmoji: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },

  // All Done Card
  allDoneCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  allDoneEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  allDoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#388E3C',
    marginBottom: 2,
  },
  allDoneText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#4CAF50',
  },

  // Group Title
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
  },

  // Bottom Add Button
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  bottomAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.warm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: 8,
    ...Shadows.large,
  },
  bottomAddButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
