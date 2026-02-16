import { create } from 'zustand';
import { NotificationService } from '../services/notificationService';
import { useNotificationStore } from './notificationStore';
import { useCatStore } from './catStore';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  scheduledTime: string;
  icon: string;
  color: string;
  taken: boolean;
  takenAt: string | null;
  reminderEnabled: boolean;
  notificationIds: string[];
}

interface MedicationStore {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id' | 'taken' | 'takenAt' | 'reminderEnabled' | 'notificationIds'>) => void;
  removeMedication: (id: string) => void;
  markMedicationTaken: (id: string) => boolean;
  resetDaily: () => void;
}

let idCounter = 0;

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: [],

  addMedication: async (medication) => {
    idCounter += 1;
    const id = `${Date.now()}_${idCounter}`;

    // Schedule notifications if enabled
    let notificationIds: string[] = [];
    const notifPrefs = useNotificationStore.getState().preferences;
    if (notifPrefs.masterEnabled && notifPrefs.medicationReminders && medication.times.length > 0) {
      try {
        notificationIds = await NotificationService.scheduleMedicationNotifications(
          id,
          medication.name,
          medication.dosage || 'As directed',
          medication.times
        );
      } catch (e) {
        console.warn('[MedicationStore] Failed to schedule notifications:', e);
      }
    }

    set((state) => ({
      medications: [
        ...state.medications,
        {
          ...medication,
          id,
          taken: false,
          takenAt: null,
          reminderEnabled: true,
          notificationIds,
        },
      ],
    }));

    // Update badge count
    const pending = get().medications.filter((m) => !m.taken).length + 1;
    NotificationService.updateBadgeCount(pending).catch(() => {});
  },

  removeMedication: async (id) => {
    // Cancel notifications for this medication
    const med = get().medications.find((m) => m.id === id);
    if (med) {
      try {
        if (med.notificationIds.length > 0) {
          await NotificationService.cancelNotifications(med.notificationIds);
        }
        await NotificationService.cancelMedicationNotifications(id);
      } catch (e) {
        console.warn('[MedicationStore] Failed to cancel notifications:', e);
      }
    }

    set((state) => ({
      medications: state.medications.filter((m) => m.id !== id),
    }));

    // Update badge count
    const pending = get().medications.filter((m) => !m.taken).length;
    NotificationService.updateBadgeCount(pending).catch(() => {});
  },

  markMedicationTaken: (id) => {
    const med = get().medications.find((m) => m.id === id);
    if (!med || med.taken) return false;

    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id
          ? { ...m, taken: true, takenAt: new Date().toISOString() }
          : m
      ),
    }));

    // Record activity for background task inactivity check
    NotificationService.recordMedicationTaken().catch(() => {});

    // Send celebration notification (async, fire-and-forget)
    const notifPrefs = useNotificationStore.getState().preferences;
    if (notifPrefs.masterEnabled && notifPrefs.celebrations) {
      NotificationService.sendCelebration(med.name, 10, 5).catch(() => {});
    }

    // Check streak milestone
    const catState = useCatStore.getState();
    if (notifPrefs.masterEnabled && notifPrefs.streakMilestones) {
      NotificationService.sendStreakMilestone(catState.streak).catch(() => {});
    }

    // Check for level up after XP is added (will be called from HomeScreen)
    // The level-up notification is triggered from the UI layer via catStore.lastLevelUp

    // Update badge count
    const pending = get().medications.filter((m) => !m.taken).length;
    NotificationService.updateBadgeCount(pending).catch(() => {});

    return true;
  },

  resetDaily: () => {
    set((state) => ({
      medications: state.medications.map((m) => ({
        ...m,
        taken: false,
        takenAt: null,
      })),
    }));

    // Update badge count to total medications
    const total = get().medications.length;
    NotificationService.updateBadgeCount(total).catch(() => {});
  },
}));
