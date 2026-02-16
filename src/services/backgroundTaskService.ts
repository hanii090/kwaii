import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { NotificationService } from './notificationService';

const BACKGROUND_FETCH_TASK = 'kawaii-meds-background-check';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const hoursSinceLastMed = await NotificationService.getHoursSinceLastMedication();

    // Send encouragement if inactive for 48+ hours
    if (hoursSinceLastMed >= 48) {
      await NotificationService.sendEncouragement();
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    if (__DEV__) console.error('[BackgroundTask] Error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Register the background fetch task.
 * Checks every ~6 hours for inactivity.
 */
export async function registerBackgroundFetch(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if (isRegistered) return;

    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 60 * 6, // 6 hours
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (error) {
    if (__DEV__) console.warn('[BackgroundTask] Registration failed:', error);
  }
}

/**
 * Unregister the background fetch task.
 */
export async function unregisterBackgroundFetch(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
  } catch (error) {
    if (__DEV__) console.warn('[BackgroundTask] Unregistration failed:', error);
  }
}
