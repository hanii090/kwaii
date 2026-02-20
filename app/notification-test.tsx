import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../src/constants/theme';
import { NotificationService } from '../src/services/notificationService';
import { useNotificationStore } from '../src/stores/notificationStore';
import {
  BeakerIcon,
  MedPillIcon,
  CelebrationIcon,
  StreakFlameIcon,
  SadCatIcon,
  ClipboardIcon,
  SparkleIcon,
  StarIcon,
  RestoreIcon,
  CheckIcon,
} from '../src/components/icons/KawaiiIcons';

export default function NotificationTestScreen() {
  const { permissionStatus } = useNotificationStore();
  const [scheduledCount, setScheduledCount] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));
  };

  const handleRequestPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    useNotificationStore.getState().setPermissionStatus(granted ? 'granted' : 'denied');
    addLog(`Permissions: ${granted ? 'granted' : 'denied'}`);
  };

  const handleCheckStatus = async () => {
    const status = await NotificationService.getPermissionStatus();
    addLog(`Permission status: ${status}`);
  };

  const handleSendMedicationReminder = async () => {
    try {
      const id = await NotificationService.scheduleMedicationReminder(
        'test_med_1',
        'Test Vitamin',
        '500mg',
        new Date().getHours(),
        new Date().getMinutes() + 1 > 59 ? 0 : new Date().getMinutes() + 1
      );
      addLog(`Scheduled pill reminder: ${id.slice(0, 8)}...`);
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const handleSendIn10Seconds = async () => {
    try {
      const { default: Notifications } = await import('expo-notifications');
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from Kawaii Pills!',
          data: { type: 'test' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
        },
      });
      addLog(`Scheduled in 10s: ${id.slice(0, 8)}...`);
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const handleSendCelebration = async () => {
    try {
      await NotificationService.sendCelebration('Test Vitamin', 10, 5);
      addLog('Sent celebration notification');
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const handleSendStreak = async () => {
    try {
      const { default: Notifications } = await import('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '7 Day Streak!',
          body: "Amazing! You've built a 7-day pill habit!",
          data: { type: 'streak_milestone', days: 7 },
        },
        trigger: null,
      });
      addLog('Sent streak milestone notification');
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const handleSendLevelUp = async () => {
    try {
      await NotificationService.sendLevelUp('Snowball', 5, 50);
      addLog('Sent level up notification');
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const handleSendEncouragement = async () => {
    try {
      const { default: Notifications } = await import('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'We miss you!',
          body: 'Your cat is getting sleepy. Come back and take your pills!',
          data: { type: 'encouragement' },
        },
        trigger: null,
      });
      addLog('Sent encouragement notification');
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const handleViewScheduled = async () => {
    try {
      const notifications = await NotificationService.getAllScheduledNotifications();
      setScheduledCount(notifications.length);
      addLog(`Scheduled notifications: ${notifications.length}`);
      for (const n of notifications.slice(0, 5)) {
        const data = n.content.data as Record<string, any> | undefined;
        addLog(`  - ${n.content.title} (type: ${data?.type ?? 'unknown'})`);
      }
      if (notifications.length > 5) {
        addLog(`  ... and ${notifications.length - 5} more`);
      }
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  const handleClearAll = async () => {
    Alert.alert('Clear All?', 'Cancel all scheduled notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await NotificationService.cancelAllNotifications();
          setScheduledCount(0);
          addLog('Cleared all scheduled notifications');
        },
      },
    ]);
  };

  const handleClearBadge = async () => {
    await NotificationService.clearBadge();
    addLog('Badge cleared');
  };

  const handleUpdateBadge = async () => {
    await NotificationService.updateBadgeCount(3);
    addLog('Badge set to 3');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <BeakerIcon size={22} />
          </View>
          <Text style={styles.headerTitle}>Notification Test</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={20} color={Colors.secondary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Permission Status</Text>
          <Text style={[styles.statusValue, {
            color: permissionStatus === 'granted' ? Colors.success : '#D44',
          }]}>
            {permissionStatus.toUpperCase()}
          </Text>
          {scheduledCount !== null && (
            <>
              <Text style={styles.statusLabel}>Scheduled</Text>
              <Text style={styles.statusValue}>{scheduledCount}</Text>
            </>
          )}
        </View>

        {/* Permissions */}
        <Text style={styles.sectionLabel}>PERMISSIONS</Text>
        <View style={styles.buttonGroup}>
          <TestButton label="Request Permissions" icon={<SparkleIcon size={18} />} onPress={handleRequestPermissions} />
          <TestButton label="Check Status" icon={<CheckIcon size={18} />} onPress={handleCheckStatus} />
        </View>

        {/* Send Notifications */}
        <Text style={styles.sectionLabel}>SEND NOTIFICATIONS</Text>
        <View style={styles.buttonGroup}>
          <TestButton label="Pill Reminder (+1 min)" icon={<MedPillIcon size={18} />} onPress={handleSendMedicationReminder} />
          <TestButton label="Test in 10 Seconds" icon={<StarIcon size={18} />} onPress={handleSendIn10Seconds} />
          <TestButton label="Celebration" icon={<CelebrationIcon size={18} />} onPress={handleSendCelebration} />
          <TestButton label="Streak Milestone" icon={<StreakFlameIcon size={18} />} onPress={handleSendStreak} />
          <TestButton label="Level Up" icon={<CelebrationIcon size={18} />} onPress={handleSendLevelUp} />
          <TestButton label="Encouragement" icon={<SadCatIcon size={18} />} onPress={handleSendEncouragement} />
        </View>

        {/* Management */}
        <Text style={styles.sectionLabel}>MANAGEMENT</Text>
        <View style={styles.buttonGroup}>
          <TestButton label="View Scheduled" icon={<ClipboardIcon size={18} />} onPress={handleViewScheduled} />
          <TestButton label="Clear All Notifications" icon={<RestoreIcon size={18} />} onPress={handleClearAll} danger />
          <TestButton label="Clear Badge" icon={<CheckIcon size={18} />} onPress={handleClearBadge} />
          <TestButton label="Set Badge to 3" icon={<StarIcon size={18} />} onPress={handleUpdateBadge} />
        </View>

        {/* Log */}
        <Text style={styles.sectionLabel}>LOG</Text>
        <View style={styles.logCard}>
          {log.length === 0 ? (
            <Text style={styles.logEmpty}>No actions yet. Tap a button above.</Text>
          ) : (
            log.map((entry, i) => (
              <Text key={i} style={styles.logEntry}>{entry}</Text>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface TestButtonProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}

function TestButton({ label, icon, onPress, danger }: TestButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.testButton, danger && styles.testButtonDanger]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.testButtonIconWrap}>{icon}</View>
      <Text style={[styles.testButtonLabel, danger && styles.testButtonLabelDanger]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.lightText,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: Spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lightText,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  buttonGroup: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  testButtonDanger: {
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  testButtonIconWrap: {
    width: 24,
    alignItems: 'center',
  },
  testButtonLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  testButtonLabelDanger: {
    color: '#D44',
  },
  logCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 100,
    ...Shadows.small,
  },
  logEmpty: {
    fontSize: 13,
    color: Colors.lightText,
    fontStyle: 'italic',
  },
  logEntry: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 2,
  },
});
