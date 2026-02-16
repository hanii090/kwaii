import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import ConfettiOverlay from '../../src/components/ConfettiOverlay';
import RewardToast from '../../src/components/RewardToast';
import LevelUpModal from '../../src/components/LevelUpModal';
import CatIllustration from '../../src/components/CatIllustration';
import StreakFire from '../../src/components/animations/StreakFire';
import XPBarFill from '../../src/components/animations/XPBarFill';

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
  const { medications, markMedicationTaken } = useMedicationStore();
  const { onMedicationTaken } = useAnimationTrigger();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const takenCount = medications.filter((m) => m.taken).length;
  const totalCount = medications.length;
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
        const allTaken = updatedMeds.length > 0 && updatedMeds.every((m) => m.taken);
        if (allTaken) {
          incrementStreak();
        }

        setToastMessage('✨ +10 XP, +5 Coins!');
        setShowToast(true);
        setShowConfetti(true);
      }
    },
    [markMedicationTaken, addXp, addCoins, incrementStreak, incrementMedsTaken, getActiveCat, onMedicationTaken]
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
                <Text style={styles.coinIconEmoji}>🪙</Text>
              </View>
              <Text style={styles.coinsCount}>{coins}</Text>
            </View>
          </View>
        </View>

        {/* Cat Display Card */}
        <View style={styles.catCard}>
          {/* Sky gradient background */}
          <View style={styles.skyGradient}>
            {/* Clouds */}
            <View style={[styles.cloud, { top: 12, left: 20 }]}>
              <View style={styles.cloudPuff} />
              <View style={[styles.cloudPuff, styles.cloudPuffSmall]} />
            </View>
            <View style={[styles.cloud, { top: 8, right: 30 }]}>
              <View style={styles.cloudPuff} />
              <View style={[styles.cloudPuff, styles.cloudPuffSmall]} />
            </View>
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
              <Text style={styles.catLevelStar}>⭐</Text>
              <Text style={styles.catLevelText}>Level {activeCat.level}</Text>
            </View>
          </View>

          {/* Cat illustration */}
          <View style={styles.catIllustrationContainer}>
            <CatIllustration
              breed={activeCat.breed}
              size={120}
              state={activeCat.state}
              showBackground={false}
            />
          </View>

          {/* Grass tufts */}
          <View style={styles.grassContainer}>
            <Text style={styles.grassTuft}>🌿</Text>
            <Text style={[styles.grassTuft, { left: '30%' }]}>🌱</Text>
            <Text style={[styles.grassTuft, { right: '25%' }]}>🌿</Text>
          </View>

          {/* XP Bar */}
          <View style={styles.xpBarContainer}>
            <XPBarFill
              currentXP={activeCat.currentXP}
              maxXP={xpNeeded}
              level={activeCat.level}
              showLevelUp={!!lastLevelUp}
              height={10}
            />
          </View>
        </View>

        {/* Today's Medicine */}
        <View style={styles.medsSection}>
          <Text style={styles.sectionTitle}>Today's Medicine</Text>
          <Text style={styles.dateSubtitle}>{dateStr}</Text>

          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyEmoji}>💊</Text>
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

              {medications.map((med) => (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  onTakeMedication={handleTakeMedication}
                />
              ))}
            </>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Add New Medication Button */}
      {medications.length > 0 && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.bottomAddButton}
            activeOpacity={0.85}
            onPress={() => router.push('/add-medication')}
          >
            <Plus size={20} color={Colors.white} strokeWidth={3} />
            <Text style={styles.bottomAddButtonText}>Add New Medication</Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    height: 260,
    position: 'relative',
  },
  skyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#B8E6E8',
  },
  cloud: {
    position: 'absolute',
    flexDirection: 'row',
  },
  cloudPuff: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  cloudPuffSmall: {
    width: 28,
    height: 16,
    borderRadius: 8,
    marginLeft: -10,
    marginTop: 4,
  },
  hills: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  hill: {
    position: 'absolute',
    bottom: 0,
    width: '120%',
    height: 100,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },
  hillFar: {
    backgroundColor: '#8BC89C',
    bottom: 50,
    left: -30,
  },
  hillMid: {
    backgroundColor: '#A8D5A8',
    bottom: 25,
    right: -20,
  },
  hillNear: {
    backgroundColor: '#C8DD9F',
    bottom: 0,
    left: -10,
  },

  catNameBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 10,
  },
  catNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  catLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  catLevelStar: {
    fontSize: 11,
  },
  catLevelText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.secondary,
  },

  catIllustrationContainer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    zIndex: 5,
  },

  grassContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  grassTuft: {
    fontSize: 14,
  },

  xpBarContainer: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    zIndex: 10,
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
