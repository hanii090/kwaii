export type CatBreed =
  | 'basic'
  | 'cloud'
  | 'cocoa'
  | 'mochi'
  | 'midnight_void';

export type CatState = 'happy' | 'neutral' | 'sleepy' | 'excited';

export interface Cat {
  id: string;
  breed: CatBreed;
  name: string;
  level: number;
  currentXP: number;
  totalXP: number;
  state: CatState;
  purchasedAt: string;
  isActive: boolean;
}

export interface ShopCatItem {
  id: string;
  breed: CatBreed;
  name: string;
  description: string;
  price: number;
  category: 'common' | 'rare' | 'epic' | 'legendary';
  emoji: string;
  unlockLevel?: number;
}

export interface UserProfile {
  name: string;
  onboardingComplete: boolean;
  createdAt: string;
  preferences: Preferences;
}

export interface Preferences {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reminderMinutesBefore: number;
}

export type NotificationType =
  | 'medication_reminder'
  | 'celebration'
  | 'streak_milestone'
  | 'level_up'
  | 'missed_warning'
  | 'daily_summary'
  | 'encouragement'
  | 'snoozed_reminder';

export interface NotificationPreferences {
  masterEnabled: boolean;
  medicationReminders: boolean;
  celebrations: boolean;
  streakMilestones: boolean;
  encouragement: boolean;
  dailySummary: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: number; // hour 0-23
  quietHoursEnd: number;   // hour 0-23
}
