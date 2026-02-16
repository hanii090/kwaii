import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PawPrint } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useCatStore } from '../../src/stores/catStore';
import CatIllustration from '../../src/components/CatIllustration';
import type { Cat } from '../../src/types';

const STATE_EMOJI: Record<string, string> = {
  happy: '😊',
  neutral: '😺',
  sleepy: '😴',
  excited: '🤩',
};

export default function CatsScreen() {
  const { cats, activeCatId, nameTags, setActiveCat, renameCat } = useCatStore();
  const [renameModal, setRenameModal] = useState<{ visible: boolean; catId: string; currentName: string }>({
    visible: false,
    catId: '',
    currentName: '',
  });
  const [nameInput, setNameInput] = useState('');

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

  const handleConfirmRename = () => {
    if (nameInput.trim() && nameInput.trim() !== renameModal.currentName) {
      const success = renameCat(renameModal.catId, nameInput.trim());
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    setRenameModal({ visible: false, catId: '', currentName: '' });
  };

  const renderCatCard = ({ item }: { item: Cat }) => {
    const isActive = item.id === activeCatId;
    const xpNeeded = item.level * 100;
    const xpPercent = xpNeeded > 0 ? (item.currentXP / xpNeeded) * 100 : 0;
    const moodEmoji = STATE_EMOJI[item.state] || '😺';

    return (
      <TouchableOpacity
        style={[styles.catCard, isActive && styles.catCardActive]}
        onPress={() => handleSetActive(item.id)}
        activeOpacity={0.7}
      >
        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>👑 Active</Text>
          </View>
        )}

        {/* Mood indicator */}
        <View style={styles.moodBadge}>
          <Text style={styles.moodEmoji}>{moodEmoji}</Text>
        </View>

        {/* Cat image with glow ring for active */}
        <View style={[styles.catImageContainer, isActive && styles.catImageActive]}>
          <CatIllustration breed={item.breed} size={95} state={item.state} showBackground={false} />
        </View>

        <Text style={styles.catName} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Level badge */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelStar}>⭐</Text>
          <Text style={styles.levelText}>Level {item.level}</Text>
        </View>

        {/* XP Bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
          </View>
          <Text style={styles.xpText}>
            {item.currentXP}/{xpNeeded} XP
          </Text>
        </View>

        {/* Rename button */}
        <TouchableOpacity
          style={styles.renameButton}
          onPress={() => handleOpenRename(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.renameButtonText}>✏️ Rename</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PawPrint size={22} color={Colors.warm} strokeWidth={2.5} />
          <Text style={styles.screenTitle}>Your Cats</Text>
        </View>
        <View style={styles.nameTagBadge}>
          <Text style={styles.nameTagEmoji}>🏷️</Text>
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

      {/* Rename Modal */}
      <Modal visible={renameModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>✏️</Text>
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
            <Text style={styles.modalCost}>🏷️ Costs 1 name tag</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRenameModal({ visible: false, catId: '', currentName: '' })}
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
          </View>
        </View>
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
  modalEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
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
  modalCost: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.lightText,
    marginBottom: Spacing.lg,
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
