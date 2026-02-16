import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  MedPillIcon,
  CelebrationIcon,
  StreakFlameIcon,
  ChartIcon,
  NotifBellIcon,
} from '../icons/KawaiiIcons';

interface BenefitRowProps {
  icon: React.ReactNode;
  text: string;
}

function BenefitRow({ icon, text }: BenefitRowProps) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.benefitIconWrap}>{icon}</View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

interface NotificationPermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export default function NotificationPermissionModal({
  visible,
  onAllow,
  onDeny,
}: NotificationPermissionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.emojiWrap}>
            <NotifBellIcon size={48} />
          </View>
          <Text style={styles.title}>Enable Notifications?</Text>
          <Text style={styles.description}>
            Get reminders so you never miss a dose. We'll send you:
          </Text>

          <View style={styles.benefits}>
            <BenefitRow icon={<MedPillIcon size={20} />} text="Medication reminders" />
            <BenefitRow icon={<CelebrationIcon size={20} />} text="Celebration alerts" />
            <BenefitRow icon={<StreakFlameIcon size={20} />} text="Streak milestones" />
            <BenefitRow icon={<ChartIcon size={20} />} text="Daily summaries" />
          </View>

          <TouchableOpacity
            style={styles.allowButton}
            onPress={onAllow}
            activeOpacity={0.85}
          >
            <Text style={styles.allowText}>Allow Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.denyButton}
            onPress={onDeny}
            activeOpacity={0.7}
          >
            <Text style={styles.denyText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modal: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Shadows.large,
  },
  emojiWrap: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  benefitIconWrap: {
    width: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  benefits: {
    width: '100%',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
  },
  benefitIcon: {
    fontSize: 18,
  },
  benefitText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  allowButton: {
    width: '100%',
    backgroundColor: Colors.warm,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  allowText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
  },
  denyButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  denyText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.lightText,
  },
});
