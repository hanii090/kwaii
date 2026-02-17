import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  CrownIcon,
  SadCatIcon,
  SparkleIcon,
  HeartIcon,
} from '../icons/KawaiiIcons';

interface PerkRowProps {
  icon: React.ReactNode;
  text: string;
}

function PerkRow({ icon, text }: PerkRowProps) {
  return (
    <View style={styles.perkRow}>
      <View style={styles.perkIconWrap}>{icon}</View>
      <Text style={styles.perkText}>{text}</Text>
    </View>
  );
}

interface PaywallModalProps {
  visible: boolean;
  isLoading: boolean;
  onPurchase: () => void;
  onRestore: () => void;
  onClose: () => void;
}

export default function PaywallModal({
  visible,
  isLoading,
  onPurchase,
  onRestore,
  onClose,
}: PaywallModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.crownWrap}>
            <CrownIcon size={56} />
          </View>
          <Text style={styles.title}>Kawaii Premium</Text>
          <Text style={styles.subtitle}>Unlock everything forever</Text>

          <View style={styles.perks}>
            <PerkRow icon={<SadCatIcon size={20} color="#B8D8BA" />} text="All cats unlocked instantly" />
            <PerkRow icon={<SparkleIcon size={20} color="#B8D8BA" />} text="Unlimited name tags" />
            <PerkRow icon={<SparkleIcon size={20} />} text="All future shop items free" />
            <PerkRow icon={<HeartIcon size={20} />} text="Support the developer" />
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>One-time purchase</Text>
            <Text style={styles.price}>$3.99</Text>
          </View>

          <TouchableOpacity
            style={[styles.purchaseButton, isLoading && styles.purchaseButtonDisabled]}
            onPress={onPurchase}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.purchaseText}>Unlock Premium</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={onRestore}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          <View style={styles.legalRow}>
            <TouchableOpacity onPress={() => Linking.openURL('https://rehanaslam.me/kwaii/privacy')}>
              <Text style={styles.legalText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalDot}>·</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://rehanaslam.me/kwaii/terms')}>
              <Text style={styles.legalText}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: Colors.lightText,
    fontWeight: '600',
  },
  crownWrap: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  perkIconWrap: {
    width: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.secondary,
    marginBottom: Spacing.lg,
  },
  perks: {
    width: '100%',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
  },
  perkIcon: {
    fontSize: 20,
  },
  perkText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.lightText,
    marginBottom: 2,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.warm,
  },
  purchaseButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.warm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.warm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.lightText,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  legalText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.lightText,
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontSize: 12,
    color: Colors.lightText,
  },
});
