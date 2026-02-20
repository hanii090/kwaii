import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/theme';
import type { NotificationType } from '../types';

const LAST_ENCOURAGEMENT_KEY = '@kawaii_last_encouragement';
const LAST_MEDICATION_TAKEN_KEY = '@kawaii_last_medication_taken';

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];

export class NotificationService {
  private static responseSubscription: Notifications.Subscription | null = null;
  private static receivedSubscription: Notifications.Subscription | null = null;
  private static onNotificationResponse: ((data: Record<string, any>) => void) | null = null;

  /**
   * Initialize the entire notification system.
   * Call once on app mount.
   */
  static async initialize(): Promise<boolean> {
    await this.setupNotificationChannels();
    this.setupNotificationCategories();
    this.registerNotificationHandlers();
    const hasPermission = await this.requestPermissions();
    return hasPermission;
  }

  /**
   * Set a callback for when a notification response is received (for navigation etc.)
   */
  static setOnNotificationResponse(cb: (data: Record<string, any>) => void) {
    this.onNotificationResponse = cb;
  }

  /**
   * Request notification permissions from the user.
   */
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    return true;
  }

  /**
   * Check current permission status without prompting.
   */
  static async getPermissionStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  /**
   * Setup Android notification channels.
   */
  static async setupNotificationChannels(): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Pill Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: Colors.primary,
        enableVibrate: true,
      });

      await Notifications.setNotificationChannelAsync('celebrations', {
        name: 'Celebrations & Achievements',
        importance: Notifications.AndroidImportance.DEFAULT,
        enableVibrate: true,
      });

      await Notifications.setNotificationChannelAsync('encouragement', {
        name: 'Gentle Reminders',
        importance: Notifications.AndroidImportance.LOW,
      });
    }
  }

  /**
   * Setup notification action categories (Mark as Taken, Snooze, Skip).
   */
  static async setupNotificationCategories(): Promise<void> {
    await Notifications.setNotificationCategoryAsync('medication', [
      {
        identifier: 'mark_taken',
        buttonTitle: '✅ Mark as Taken',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'snooze',
        buttonTitle: '⏰ Snooze 10 min',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'skip',
        buttonTitle: '⏭ Skip',
        options: { opensAppToForeground: false },
      },
    ]);
  }

  /**
   * Register listeners for notification taps and foreground notifications.
   */
  static registerNotificationHandlers(): void {
    // Clean up previous subscriptions
    if (this.responseSubscription) {
      this.responseSubscription.remove();
    }
    if (this.receivedSubscription) {
      this.receivedSubscription.remove();
    }

    // Handle notification tap / action button press
    this.responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, any>;
        const actionId = response.actionIdentifier;

        if (actionId === 'mark_taken' && data.medicationId) {
          if (this.onNotificationResponse) {
            this.onNotificationResponse({ action: 'mark_taken', medicationId: data.medicationId });
          }
        } else if (actionId === 'snooze' && data.medicationId) {
          this.handleSnooze(data.medicationId as string, data.medicationName as string);
        } else if (actionId === 'skip') {
          // Skip - just dismiss, no further action needed
        } else {
          // Default tap - navigate to screen if specified
          if (this.onNotificationResponse) {
            this.onNotificationResponse(data);
          }
        }
      }
    );

    // Handle notification received while app is in foreground
    this.receivedSubscription = Notifications.addNotificationReceivedListener(
      (_notification) => {
        // Could trigger in-app banner here
      }
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCHEDULING METHODS
  // ═══════════════════════════════════════════════════════

  /**
   * Schedule a daily recurring medication reminder.
   * Returns the notification identifier for later cancellation.
   */
  static async scheduleMedicationReminder(
    medicationId: string,
    medicationName: string,
    dosage: string,
    hour: number,
    minute: number
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time for your pill! 💊',
        body: `Don't forget to take ${dosage} of ${medicationName}`,
        data: {
          medicationId,
          medicationName,
          type: 'medication_reminder' as NotificationType,
          screen: 'Home',
        },
        badge: 1,
        categoryIdentifier: 'medication',
        ...(Platform.OS === 'android' && { channelId: 'medication-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    return notificationId;
  }

  /**
   * Schedule a missed medication warning 30 minutes after scheduled time.
   */
  static async scheduleMissedWarning(
    medicationId: string,
    medicationName: string,
    hour: number,
    minute: number
  ): Promise<string> {
    // Add 30 minutes
    let warningHour = hour;
    let warningMinute = minute + 30;
    if (warningMinute >= 60) {
      warningMinute -= 60;
      warningHour = (warningHour + 1) % 24;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Gentle reminder 🐱',
        body: `You haven't taken ${medicationName} yet. Your cat misses you!`,
        data: {
          medicationId,
          medicationName,
          type: 'missed_warning' as NotificationType,
          screen: 'Home',
        },
        categoryIdentifier: 'medication',
        ...(Platform.OS === 'android' && { channelId: 'encouragement' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: warningHour,
        minute: warningMinute,
      },
    });

    return notificationId;
  }

  /**
   * Schedule all notifications for a single medication.
   * Returns array of notification IDs.
   */
  static async scheduleMedicationNotifications(
    medicationId: string,
    medicationName: string,
    dosage: string,
    times: string[] // format: "HH:MM"
  ): Promise<string[]> {
    const notificationIds: string[] = [];

    for (const time of times) {
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      if (isNaN(hour) || isNaN(minute)) continue;

      // Schedule the main reminder
      const reminderId = await this.scheduleMedicationReminder(
        medicationId,
        medicationName,
        dosage,
        hour,
        minute
      );
      notificationIds.push(reminderId);

      // Schedule the missed warning (+30 min)
      const warningId = await this.scheduleMissedWarning(
        medicationId,
        medicationName,
        hour,
        minute
      );
      notificationIds.push(warningId);
    }

    return notificationIds;
  }

  /**
   * Schedule daily summary notification at 9 PM.
   */
  static async scheduleDailySummary(): Promise<string> {
    // Cancel existing daily summary first
    await this.cancelNotificationsByType('daily_summary');

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Today's Summary 📊",
        body: 'Tap to see your pill stats for today',
        data: {
          type: 'daily_summary' as NotificationType,
          screen: 'Calendar',
        },
        ...(Platform.OS === 'android' && { channelId: 'encouragement' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    });

    return notificationId;
  }

  // ═══════════════════════════════════════════════════════
  // IMMEDIATE NOTIFICATION METHODS
  // ═══════════════════════════════════════════════════════

  /**
   * Send celebration notification when medication is taken.
   */
  static async sendCelebration(
    medicationName: string,
    xpEarned: number,
    coinsEarned: number
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Great job! 🎉',
        body: `You took ${medicationName}! +${xpEarned} XP, +${coinsEarned} coins`,
        data: { type: 'celebration' as NotificationType },
        ...(Platform.OS === 'android' && { channelId: 'celebrations' }),
      },
      trigger: null,
    });
  }

  /**
   * Send streak milestone notification if applicable.
   */
  static async sendStreakMilestone(streakDays: number): Promise<void> {
    if (!STREAK_MILESTONES.includes(streakDays)) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔥 ${streakDays} Day Streak!`,
        body: `Amazing! You've built a ${streakDays}-day pill habit!`,
        data: {
          type: 'streak_milestone' as NotificationType,
          days: streakDays,
          screen: 'Calendar',
        },
        ...(Platform.OS === 'android' && { channelId: 'celebrations' }),
      },
      trigger: null,
    });
  }

  /**
   * Send level up notification.
   */
  static async sendLevelUp(
    catName: string,
    newLevel: number,
    coinsEarned: number
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🎊 ${catName} leveled up!`,
        body: `${catName} is now Level ${newLevel}! You earned ${coinsEarned} bonus coins!`,
        data: {
          type: 'level_up' as NotificationType,
          level: newLevel,
          screen: 'Cats',
        },
        ...(Platform.OS === 'android' && { channelId: 'celebrations' }),
      },
      trigger: null,
    });
  }

  /**
   * Send encouragement notification (rate limited: once per day, respects quiet hours).
   */
  static async sendEncouragement(): Promise<void> {
    const lastSent = await AsyncStorage.getItem(LAST_ENCOURAGEMENT_KEY);
    const now = Date.now();

    // Only send once per day
    if (lastSent && now - parseInt(lastSent, 10) < 24 * 60 * 60 * 1000) {
      return;
    }

    // Don't send during sleep hours (10 PM - 8 AM)
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 8) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'We miss you! 😿',
        body: 'Your cat is getting sleepy. Come back and take your pills!',
        data: {
          type: 'encouragement' as NotificationType,
          screen: 'Home',
        },
        ...(Platform.OS === 'android' && { channelId: 'encouragement' }),
      },
      trigger: null,
    });

    await AsyncStorage.setItem(LAST_ENCOURAGEMENT_KEY, now.toString());
  }

  // ═══════════════════════════════════════════════════════
  // ACTION HANDLERS
  // ═══════════════════════════════════════════════════════

  /**
   * Handle snooze action: reschedule in 10 minutes.
   */
  static async handleSnooze(
    medicationId: string,
    medicationName?: string
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pill reminder ⏰',
        body: medicationName
          ? `Snoozed reminder for ${medicationName}`
          : 'You snoozed this reminder 10 minutes ago',
        data: {
          medicationId,
          medicationName,
          type: 'snoozed_reminder' as NotificationType,
          screen: 'Home',
        },
        categoryIdentifier: 'medication',
        ...(Platform.OS === 'android' && { channelId: 'medication-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 600,
      },
    });
  }

  // ═══════════════════════════════════════════════════════
  // BADGE MANAGEMENT
  // ═══════════════════════════════════════════════════════

  /**
   * Update the app badge count to the number of pending medications today.
   */
  static async updateBadgeCount(pendingCount: number): Promise<void> {
    await Notifications.setBadgeCountAsync(Math.max(0, pendingCount));
  }

  /**
   * Clear the app badge.
   */
  static async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // ═══════════════════════════════════════════════════════
  // CANCELLATION METHODS
  // ═══════════════════════════════════════════════════════

  /**
   * Cancel specific notifications by their IDs.
   */
  static async cancelNotifications(notificationIds: string[]): Promise<void> {
    for (const id of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  /**
   * Cancel all notifications that match a given medication ID.
   */
  static async cancelMedicationNotifications(medicationId: string): Promise<void> {
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of allNotifications) {
      const data = notification.content.data as Record<string, any> | undefined;
      if (data?.medicationId === medicationId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  /**
   * Cancel all notifications of a specific type.
   */
  static async cancelNotificationsByType(type: NotificationType): Promise<void> {
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of allNotifications) {
      const data = notification.content.data as Record<string, any> | undefined;
      if (data?.type === type) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  /**
   * Cancel ALL scheduled notifications.
   */
  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all currently scheduled notifications (useful for debugging).
   */
  static async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // ═══════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════

  /**
   * Record that a medication was taken (for background task inactivity check).
   */
  static async recordMedicationTaken(): Promise<void> {
    await AsyncStorage.setItem(LAST_MEDICATION_TAKEN_KEY, Date.now().toString());
  }

  /**
   * Get hours since last medication was taken.
   */
  static async getHoursSinceLastMedication(): Promise<number> {
    const lastTaken = await AsyncStorage.getItem(LAST_MEDICATION_TAKEN_KEY);
    if (!lastTaken) return 999;
    return (Date.now() - parseInt(lastTaken, 10)) / (1000 * 60 * 60);
  }

  /**
   * Clean up subscriptions.
   */
  static cleanup(): void {
    if (this.responseSubscription) {
      this.responseSubscription.remove();
      this.responseSubscription = null;
    }
    if (this.receivedSubscription) {
      this.receivedSubscription.remove();
      this.receivedSubscription = null;
    }
  }
}
