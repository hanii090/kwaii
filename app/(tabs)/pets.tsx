import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useCatStore } from '../../src/stores/catStore';
import CatIllustration from '../../src/components/CatIllustration';
import AnimatedCat from '../../src/components/AnimatedCat';
import type { Cat } from '../../src/types';
import {
  CrownIcon,
  StarIcon,
  CatFaceIcon,
  SparkleIcon,
  PencilIcon,
  NameTagIcon,
  HappyCatMoodIcon,
  NeutralCatMoodIcon,
  SleepyCatMoodIcon,
  ExcitedCatMoodIcon,
} from '../../src/components/icons/KawaiiIcons';

const STATE_MOOD_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  happy: HappyCatMoodIcon,
  neutral: NeutralCatMoodIcon,
  sleepy: SleepyCatMoodIcon,
  excited: ExcitedCatMoodIcon,
};

// Animated card wrapper for staggered entry + press spring
function AnimatedCatCard({
  item,
  index,
  isActive,
  onPress,
  onRename,
}: {
  item: Cat;
  index: number;
  isActive: boolean;
  onPress: () => void;
  onRename: () => void;
}) {
  const xpNeeded = item.level * 100;
  const xpPercent = xpNeeded > 0 ? (item.currentXP / xpNeeded) * 100 : 0;
  const MoodIcon = STATE_MOOD_ICON[item.state] || NeutralCatMoodIcon;

  // Staggered entry animation
  const entryAnim = useRef(new Animated.Value(0)).current;
  // Press spring
  const pressScale = useRef(new Animated.Value(1)).current;
  // Active glow pulse
  const glowAnim = useRef(new Animated.Value(0)).current;
  // Mood bounce
  const moodBounce = useRef(new Animated.Value(1)).current;
  // Breathing for basic cats
  const breatheScale = useRef(new Animated.Value(1)).current;
  // XP bar animated width
  const xpWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered fade-in + slide-up
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 120,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Active glow pulse
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isActive]);

  useEffect(() => {
    // Mood emoji gentle bounce loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(moodBounce, { toValue: 1.2, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(moodBounce, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Breathing animation for basic cats
    if (item.breed === 'basic') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheScale, { toValue: 1.04, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(breatheScale, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [item.breed]);

  useEffect(() => {
    // Animate XP bar fill
    Animated.timing(xpWidth, {
      toValue: xpPercent,
      duration: 600,
      delay: index * 120 + 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [xpPercent]);

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.95, damping: 15, stiffness: 300, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }).start();
  };

  const glowShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.4],
  });

  const glowShadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 20],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: entryAnim,
        transform: [
          { translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          { scale: pressScale },
        ],
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.catCard,
            isActive && styles.catCardActive,
            isActive && {
              shadowOpacity: glowShadowOpacity,
              shadowRadius: glowShadowRadius,
            },
          ]}
        >
          {isActive && (
            <View style={styles.activeBadge}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <CrownIcon size={10} color="#FFFFFF" />
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
            </View>
          )}

          {/* Mood indicator with bounce */}
          <Animated.View style={[styles.moodBadge, { transform: [{ scale: moodBounce }] }]}>
            <MoodIcon size={18} />
          </Animated.View>

          {/* Cat image with glow ring for active */}
          <View style={[styles.catImageContainer, isActive && styles.catImageActive]}>
            {item.breed !== 'basic' ? (
              <AnimatedCat
                breed={item.breed}
                animationType="idle"
                isPremium={true}
                size={95}
                enableInteraction={false}
              />
            ) : (
              <Animated.View style={{ transform: [{ scale: breatheScale }] }}>
                <CatIllustration breed={item.breed} size={95} state={item.state} showBackground={false} />
              </Animated.View>
            )}
          </View>

          <Text style={styles.catName} numberOfLines={1}>
            {item.name}
          </Text>

          {/* Level badge */}
          <View style={styles.levelBadge}>
            <StarIcon size={12} />
            <Text style={styles.levelText}>Level {item.level}</Text>
          </View>

          {/* XP Bar with animated fill */}
          <View style={styles.xpContainer}>
            <View style={styles.xpTrack}>
              <Animated.View
                style={[
                  styles.xpFill,
                  { width: xpWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' }) },
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {item.currentXP}/{xpNeeded} XP
            </Text>
          </View>

          {/* Rename button */}
          <TouchableOpacity
            style={styles.renameButton}
            onPress={onRename}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <PencilIcon size={13} />
              <Text style={styles.renameButtonText}>Rename</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function CatsScreen() {
  const { cats, activeCatId, nameTags, setActiveCat, renameCat } = useCatStore();
  const [renameModal, setRenameModal] = useState<{ visible: boolean; catId: string; currentName: string }>({
    visible: false,
    catId: '',
    currentName: '',
  });
  const [nameInput, setNameInput] = useState('');

  // Modal spring animation
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (renameModal.visible) {
      modalScale.setValue(0.6);
      modalOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(modalScale, { toValue: 1, damping: 12, stiffness: 200, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [renameModal.visible]);

  const handleSetActive = (catId: string) => {
    if (catId === activeCatId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCat(catId);
  };

  const handleOpenRename = (cat: Cat) => {
    if (nameTags <= 0) {
      Alert.alert('No Name Tags', 'You need name tags to rename your cat. Earn more by leveling up!');
      return;
    }
    setNameInput(cat.name);
    setRenameModal({ visible: true, catId: cat.id, currentName: cat.name });
  };

  const handleCloseModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(modalScale, { toValue: 0.6, duration: 150, useNativeDriver: true }),
      Animated.timing(modalOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setRenameModal({ visible: false, catId: '', currentName: '' });
    });
  }, []);

  const handleConfirmRename = () => {
    if (nameInput.trim() && nameInput.trim() !== renameModal.currentName) {
      const success = renameCat(renameModal.catId, nameInput.trim());
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    handleCloseModal();
  };

  const renderCatCard = ({ item, index }: { item: Cat; index: number }) => {
    const isActive = item.id === activeCatId;
    return (
      <AnimatedCatCard
        item={item}
        index={index}
        isActive={isActive}
        onPress={() => handleSetActive(item.id)}
        onRename={() => handleOpenRename(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CatFaceIcon size={22} />
          <Text style={styles.screenTitle}>Your Cats</Text>
        </View>
        <View style={styles.nameTagBadge}>
          <SparkleIcon size={14} />
          <Text style={styles.nameTagText}>{nameTags}</Text>
        </View>
      </View>

      <Text style={styles.instruction}>
        Tap a cat to set it active • Rename uses 1 Name Tag
      </Text>

      {/* Cats Grid */}
      <FlatList
        data={cats}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={renderCatCard}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* Rename Modal with spring animation */}
      <Modal visible={renameModal.visible} transparent animationType="none">
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}>
            <View style={styles.modalIconCircle}>
              <PencilIcon size={28} />
            </View>
            <Text style={styles.modalTitle}>Rename your cat</Text>
            <TextInput
              style={styles.modalInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter name..."
              placeholderTextColor={Colors.lightText}
              autoFocus
              maxLength={20}
            />
            <View style={styles.modalCostRow}>
              <NameTagIcon size={16} />
              <Text style={styles.modalCost}>Costs 1 name tag</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={handleCloseModal}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmRename}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
  },
  nameTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    gap: 5,
    borderWidth: 1.5,
    borderColor: '#FFD54F',
    ...Shadows.small,
  },
  nameTagEmoji: {
    fontSize: 14,
  },
  nameTagText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B8860B',
  },
  instruction: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.lightText,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  gridContent: {
    paddingHorizontal: Spacing.md,
  },
  gridRow: {
    gap: 12,
  },

  // Cat Card
  catCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 22,
    paddingHorizontal: Spacing.md,
    paddingTop: 14,
    paddingBottom: Spacing.md,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  catCardActive: {
    borderColor: Colors.warm,
    borderWidth: 2.5,
    backgroundColor: '#FFFAF3',
    shadowColor: Colors.warm,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  activeBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: Colors.warm,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
    zIndex: 5,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  moodBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 5,
  },
  moodEmoji: {
    fontSize: 16,
  },
  catImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF8E1',
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  catImageActive: {
    borderColor: Colors.warm,
    backgroundColor: '#FFF5E6',
  },
  catName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: 8,
  },
  levelStar: {
    fontSize: 11,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B8860B',
  },
  xpContainer: {
    width: '100%',
    marginBottom: 8,
  },
  xpTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0E6D6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.lightText,
    textAlign: 'center',
  },
  renameButton: {
    backgroundColor: '#F5F0EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  renameButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },

  // Rename Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '82%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.large,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  modalCost: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.lightText,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.secondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.warm,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
