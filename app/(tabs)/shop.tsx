import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useCatStore } from '../../src/stores/catStore';
import { usePremiumStore } from '../../src/stores/premiumStore';
import { SHOP_CATS } from '../../src/data/shopItems';
import type { ShopCatItem } from '../../src/types';
import CatIllustration from '../../src/components/CatIllustration';
import AnimatedCat from '../../src/components/AnimatedCat';
import Sparkles from '../../src/components/animations/Sparkles';
import CatConfetti from '../../src/components/animations/CatConfetti';
import CatPurchaseAnimation from '../../src/components/animations/CatPurchaseAnimation';
import PaywallModal from '../../src/components/modals/PaywallModal';
import { CrownIcon, CoinIcon, SparkleIcon } from '../../src/components/icons/KawaiiIcons';

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: '#E8F5E9', text: '#388E3C', border: '#A5D6A7' },
  rare: { bg: '#E3F2FD', text: '#1976D2', border: '#90CAF9' },
  epic: { bg: '#F3E5F5', text: '#7B1FA2', border: '#CE93D8' },
  legendary: { bg: '#FFF8E1', text: '#F57F17', border: '#FFD54F' },
};

const sortedCats = [...SHOP_CATS].sort((a, b) => a.price - b.price);

function AnimatedShopCard({
  index,
  onPress,
  isOwned,
  children,
}: {
  index: number;
  onPress: () => void;
  isOwned: boolean;
  children: React.ReactNode;
}) {
  const entryAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 450,
      delay: index * 80,
      easing: Easing.out(Easing.back(1.1)),
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.95, damping: 15, stiffness: 400, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={isOwned ? 1 : 0.9}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={{
          opacity: entryAnim,
          transform: [
            { translateY: entryAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
            { scale: pressScale },
          ],
        }}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ShopScreen() {
  const { coins, cats, purchaseCat } = useCatStore();
  const {
    isPremium,
    isLoading: premiumLoading,
    presentPaywall,
    restore,
    showFallbackPaywall,
    setShowFallbackPaywall,
    setPremium,
  } = usePremiumStore();
  const [purchaseAnim, setPurchaseAnim] = useState<{ visible: boolean; catName: string }>({
    visible: false,
    catName: '',
  });
  const [purchasingCatId, setPurchasingCatId] = useState<string | null>(null);

  const ownedCatIds = cats.map((c) => c.id);

  const handlePurchase = (item: ShopCatItem) => {
    const isOwned = ownedCatIds.includes(item.id);
    if (isOwned) return;

    if (item.price === 0) return;

    // Premium users get all cats for free
    if (isPremium) {
      Alert.alert(`Claim ${item.name}?`, 'Premium perk — this cat is free for you!', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: () => {
            const success = purchaseCat(item.id, item.breed, item.name, 0);
            if (success) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setPurchasingCatId(item.id);
              setPurchaseAnim({ visible: true, catName: item.name });
              setTimeout(() => setPurchasingCatId(null), 2000);
            }
          },
        },
      ]);
      return;
    }

    if (coins < item.price) {
      Alert.alert(
        'Not Enough Coins',
        `You need ${item.price - coins} more coins to buy ${item.name}.`,
        [
          { text: 'Keep Earning', style: 'cancel' },
          {
            text: 'Unlock Premium',
            onPress: async () => {
              const success = await presentPaywall();
              if (success) {
                Alert.alert('Welcome to Premium!', 'All cats are now free to claim!');
              }
            },
          },
        ]
      );
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
            setPurchasingCatId(item.id);
            setPurchaseAnim({ visible: true, catName: item.name });
            setTimeout(() => setPurchasingCatId(null), 2000);
          }
        },
      },
    ]);
  };


  const renderCatCard = ({ item, index }: { item: ShopCatItem; index: number }) => {
    const isOwned = ownedCatIds.includes(item.id);
    const canAfford = isPremium || coins >= item.price;
    const rarity = RARITY_COLORS[item.category] ?? RARITY_COLORS.common;

    return (
      <AnimatedShopCard index={index} onPress={() => handlePurchase(item)} isOwned={isOwned}>
      <View
        style={[
          styles.catCard,
          { borderColor: isOwned ? Colors.accent : rarity.border },
          isOwned && styles.catCardOwned,
        ]}
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
          {purchasingCatId === item.id && item.breed !== 'basic' ? (
            <View style={{ position: 'relative' }}>
              <AnimatedCat
                breed={item.breed}
                animationType="purchase"
                isPremium={true}
                size={90}
                enableInteraction={false}
              />
              <Sparkles visible={true} count={4} />
            </View>
          ) : isOwned && item.breed !== 'basic' ? (
            <AnimatedCat
              breed={item.breed}
              animationType="idle"
              isPremium={true}
              size={90}
              enableInteraction={false}
            />
          ) : (
            <CatIllustration breed={item.breed} size={90} showBackground={false} />
          )}
        </View>

        <Text style={styles.catName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.catDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.priceRow}>
          {isOwned ? (
            <View style={[styles.priceBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.priceText, { color: '#388E3C' }]}>Owned</Text>
            </View>
          ) : item.price === 0 ? (
            <View style={styles.freeBadge}>
              <SparkleIcon size={14} /><Text style={styles.freeText}> Free</Text>
            </View>
          ) : isPremium ? (
            <View style={[styles.freeBadge, { backgroundColor: '#FFF8E1' }]}>
              <CrownIcon size={14} /><Text style={[styles.freeText, { color: '#F57F17' }]}> Free</Text>
            </View>
          ) : (
            <View style={[styles.priceBadge, !canAfford && styles.priceBadgeInsufficient]}>
              <CoinIcon size={14} />
              <Text style={[styles.priceText, !canAfford && styles.priceInsufficient]}>
                {item.price}
              </Text>
            </View>
          )}
        </View>
      </View>
      </AnimatedShopCard>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CatPurchaseAnimation
        isVisible={purchaseAnim.visible}
        catName={purchaseAnim.catName}
        onComplete={() => setPurchaseAnim({ visible: false, catName: '' })}
      />
      <PaywallModal
        visible={showFallbackPaywall}
        isLoading={premiumLoading}
        onPurchase={() => {
          setPremium(true);
          setShowFallbackPaywall(false);
          Alert.alert('Welcome to Premium!', 'All cats are now free to claim!');
        }}
        onRestore={async () => {
          const success = await restore();
          if (success) {
            setShowFallbackPaywall(false);
            Alert.alert('Restored!', 'Your premium access has been restored.');
          } else {
            Alert.alert('Nothing to Restore', 'No previous purchases found.');
          }
        }}
        onClose={() => setShowFallbackPaywall(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Cat Shop</Text>
          <Text style={styles.subtitle}>
            {isPremium ? 'Premium — All cats free!' : 'Collect adorable companions!'}
          </Text>
        </View>
        {!isPremium ? (
          <View style={styles.coinsBadge}>
            <View style={styles.coinIconContainer}>
              <CoinIcon size={20} />
            </View>
            <Text style={styles.coinsText}>{coins}</Text>
          </View>
        ) : (
          <View style={styles.premiumBadge}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <CrownIcon size={14} />
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          </View>
        )}
      </View>

      {/* Premium upsell banner */}
      {!isPremium && (
        <TouchableOpacity
          style={styles.premiumBanner}
          onPress={() => presentPaywall()}
          activeOpacity={0.8}
        >
          <CrownIcon size={28} />
          <View style={styles.premiumBannerContent}>
            <Text style={styles.premiumBannerTitle}>Unlock All Cats</Text>
            <Text style={styles.premiumBannerSubtitle}>Get everything for just $3.99</Text>
          </View>
          <Text style={styles.premiumBannerArrow}>→</Text>
        </TouchableOpacity>
      )}

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

  // Premium styles
  premiumBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: '#FFD54F',
  },
  premiumBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57F17',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#FFD54F',
    gap: Spacing.sm,
    ...Shadows.small,
  },
  premiumBannerEmoji: {
    fontSize: 24,
  },
  premiumBannerContent: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B8860B',
  },
  premiumBannerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#C4A035',
    marginTop: 1,
  },
  premiumBannerArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B8860B',
  },
});
