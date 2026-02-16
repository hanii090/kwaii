import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useCatStore } from '../../src/stores/catStore';
import { SHOP_CATS } from '../../src/data/shopItems';
import type { ShopCatItem } from '../../src/types';
import CatIllustration from '../../src/components/CatIllustration';
import CatPurchaseAnimation from '../../src/components/animations/CatPurchaseAnimation';

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: '#E8F5E9', text: '#388E3C', border: '#A5D6A7' },
  rare: { bg: '#E3F2FD', text: '#1976D2', border: '#90CAF9' },
  epic: { bg: '#F3E5F5', text: '#7B1FA2', border: '#CE93D8' },
  legendary: { bg: '#FFF8E1', text: '#F57F17', border: '#FFD54F' },
};

const sortedCats = [...SHOP_CATS].sort((a, b) => a.price - b.price);

export default function ShopScreen() {
  const { coins, cats, purchaseCat } = useCatStore();
  const [purchaseAnim, setPurchaseAnim] = useState<{ visible: boolean; catName: string }>({
    visible: false,
    catName: '',
  });

  const ownedCatIds = cats.map((c) => c.id);

  const handlePurchase = (item: ShopCatItem) => {
    const isOwned = ownedCatIds.includes(item.id);
    if (isOwned) return;

    if (item.price === 0) return;

    if (coins < item.price) {
      Alert.alert('Not Enough Coins', `You need ${item.price - coins} more coins to buy ${item.name}.`);
      return;
    }

    Alert.alert(`Buy ${item.name}?`, `This will cost ${item.price} coins.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Buy',
        onPress: () => {
          const success = purchaseCat(item.id, item.breed, item.name, item.price);
          if (success) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setPurchaseAnim({ visible: true, catName: item.name });
          }
        },
      },
    ]);
  };

  const renderCatCard = ({ item }: { item: ShopCatItem }) => {
    const isOwned = ownedCatIds.includes(item.id);
    const canAfford = coins >= item.price;
    const rarity = RARITY_COLORS[item.category] ?? RARITY_COLORS.common;

    return (
      <TouchableOpacity
        style={[
          styles.catCard,
          { borderColor: isOwned ? Colors.accent : rarity.border },
          isOwned && styles.catCardOwned,
        ]}
        onPress={() => handlePurchase(item)}
        activeOpacity={isOwned ? 1 : 0.7}
      >
        {/* Rarity badge */}
        <View style={[styles.rarityBadge, { backgroundColor: rarity.bg }]}>
          <Text style={[styles.rarityText, { color: rarity.text }]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>

        {isOwned && (
          <View style={styles.ownedBadge}>
            <Text style={styles.ownedText}>✓ Owned</Text>
          </View>
        )}

        <View style={[styles.catImageContainer, { borderColor: rarity.border }]}>
          <CatIllustration breed={item.breed} size={90} showBackground={false} />
        </View>

        <Text style={styles.catName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.catDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.priceRow}>
          {item.price === 0 ? (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>✨ Free</Text>
            </View>
          ) : (
            <View style={[styles.priceBadge, !canAfford && !isOwned && styles.priceBadgeInsufficient]}>
              <Text style={styles.priceCoin}>🪙</Text>
              <Text style={[styles.priceText, !canAfford && !isOwned && styles.priceInsufficient]}>
                {isOwned ? 'Owned' : item.price}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CatPurchaseAnimation
        isVisible={purchaseAnim.visible}
        catName={purchaseAnim.catName}
        onComplete={() => setPurchaseAnim({ visible: false, catName: '' })}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Cat Shop</Text>
          <Text style={styles.subtitle}>Collect adorable companions!</Text>
        </View>
        <View style={styles.coinsBadge}>
          <View style={styles.coinIconContainer}>
            <Text style={styles.coinIconLarge}>🪙</Text>
          </View>
          <Text style={styles.coinsText}>{coins}</Text>
        </View>
      </View>

      {/* All Cats - sorted by price */}
      <FlatList
        data={sortedCats}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={renderCatCard}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
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
    paddingBottom: Spacing.md,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.lightText,
    marginTop: 2,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingRight: Spacing.md,
    paddingLeft: 6,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#FFD54F',
    ...Shadows.small,
  },
  coinIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinIconLarge: {
    fontSize: 18,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B8860B',
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
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    ...Shadows.small,
  },
  catCardOwned: {
    backgroundColor: '#F8FFF8',
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 5,
  },
  ownedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  catImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF8E1',
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  catName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 2,
    textAlign: 'center',
  },
  catDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.lightText,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    lineHeight: 16,
  },
  priceRow: {
    marginTop: 'auto',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  priceBadgeInsufficient: {
    backgroundColor: '#F5F0EB',
  },
  priceCoin: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B8860B',
  },
  priceInsufficient: {
    color: Colors.lightText,
  },
  freeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: '#E8F5E9',
  },
  freeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#388E3C',
  },
});
