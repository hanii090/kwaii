# Notification System - Kawaii Meds

Complete notification system for medication reminders, celebrations, and engagement.

---

## Architecture

```
src/services/notificationService.ts   — Core scheduling, sending, cancellation
src/services/backgroundTaskService.ts — Background inactivity check
src/stores/notificationStore.ts       — Granular notification preferences (Zustand)
src/components/modals/NotificationPermissionModal.tsx — Permission request UI
app/notification-test.tsx             — Dev testing screen
```

## Notification Types

| Type | Trigger | Channel (Android) | Priority |
|------|---------|-------------------|----------|
| **Medication Reminder** | Scheduled daily at user-set times | `medication-reminders` | HIGH |
| **Missed Warning** | 30 min after scheduled time | `encouragement` | LOW |
| **Celebration** | Medication marked as taken | `celebrations` | DEFAULT |
| **Streak Milestone** | Streak hits 3, 7, 14, 30, 60, 90, 180, 365 | `celebrations` | DEFAULT |
| **Level Up** | Cat levels up from XP | `celebrations` | DEFAULT |
| **Daily Summary** | 9:00 PM daily | `encouragement` | LOW |
| **Encouragement** | No meds taken for 48+ hours | `encouragement` | LOW |

## Quick Actions (from notification)

Medication reminders include three action buttons:
- **Mark as Taken** — marks the medication, awards XP/coins
- **Snooze 10 min** — reschedules the reminder
- **Skip** — dismisses silently

## Initialization Flow

1. `app/_layout.tsx` calls `NotificationService.initialize()` on mount
2. This requests permissions, sets up Android channels, registers action categories, and attaches response listeners
3. If permission is denied and user has completed onboarding, `NotificationPermissionModal` is shown
4. Daily summary is scheduled if enabled
5. Badge count is updated to number of pending (untaken) medications
6. Background fetch task is registered for inactivity encouragement

## Preferences (notificationStore)

All preferences are persisted in AsyncStorage under `@kawaii_notification_prefs`:

| Preference | Default | Description |
|-----------|---------|-------------|
| `masterEnabled` | `true` | Kill switch for all notifications |
| `medicationReminders` | `true` | Daily medication reminders |
| `celebrations` | `true` | "Great job!" on med taken |
| `streakMilestones` | `true` | Streak milestone alerts |
| `encouragement` | `true` | "We miss you" after 48h inactivity |
| `dailySummary` | `true` | 9 PM daily summary |
| `soundEnabled` | `true` | Notification sounds |
| `vibrationEnabled` | `true` | Vibration |
| `quietHoursEnabled` | `false` | Suppress notifications during quiet hours |
| `quietHoursStart` | `22` | Quiet hours start (10 PM) |
| `quietHoursEnd` | `8` | Quiet hours end (8 AM) |

## Medication Store Integration

- **addMedication** — schedules reminder + missed warning for each time slot, stores notification IDs
- **removeMedication** — cancels all notifications by stored IDs and by medication ID scan
- **markMedicationTaken** — records activity timestamp, sends celebration, checks streak milestone, updates badge
- **resetDaily** — updates badge to total medication count

## Background Task

Uses `expo-task-manager` + `expo-background-fetch`:
- Runs every ~6 hours (OS-controlled minimum)
- Checks hours since last medication taken
- Sends encouragement notification if 48+ hours inactive
- Respects rate limiting (once per 24h) and quiet hours (10 PM – 8 AM)

## Badge Management

- Badge = number of untaken medications today
- Updated on: add medication, remove medication, mark taken, daily reset
- Cleared via `NotificationService.clearBadge()`

## Testing

Navigate to **Settings → Notification Test** to access the dev tool screen with buttons for:
- Requesting permissions / checking status
- Sending each notification type
- Viewing all scheduled notifications
- Clearing notifications and badge

## Sound Files

Currently uses system default sounds. To add custom sounds:
1. Place `.wav` files in `src/assets/sounds/`
2. Add filenames to `app.json` → `expo-notifications.sounds` array
3. Reference by filename in notification content `sound` property
