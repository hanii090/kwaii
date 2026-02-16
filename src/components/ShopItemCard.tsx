import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import type { ShopItem } from '../data/shopItems';

interface ShopItemCardProps {
  item: ShopItem;
  owned: boolean;
  locked: boolean;
  onPurchase: (item: ShopItem) => void;
}

export default function ShopItemCard({
  item,
  owned,
  locked,
  onPurchase,
}: ShopItemCardProps) {
  const handlePress = () => {
    if (!owned && !locked) onPurchase(item);
  };

  return (
    <TouchableOpacity
      style={[styles.card, locked && styles.cardLocked]}
      onPress={handlePress}
      activeOpacity={locked || owned ? 1 : 0.7}
    >
      {locked && (
        <View style={styles.lockOverlay}>
          <Lock size={20} color={Colors.white} />
          <Text style={styles.lockText}>Lv.{item.unlockLevel}</Text>
        </View>
      )}

      {owned && (
        <View style={styles.ownedBadge}>
          <Text style={styles.ownedText}>Owned</Text>
        </View>
      )}

      <View style={[styles.emojiContainer, locked && { opacity: 0.3 }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={[styles.price, owned && styles.priceOwned]}>
          {owned ? 'Owned' : item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    margin: Spacing.xs,
    minHeight: 140,
    ...Shadows.small,
  },
  cardLocked: {
    backgroundColor: '#F5F0EB',
  },
  lockOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    zIndex: 5,
  },
  lockText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  ownedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    zIndex: 5,
  },
  ownedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  coinIcon: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B8860B',
  },
  priceOwned: {
    color: Colors.accent,
  },
});
