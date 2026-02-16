import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  days: string[]; // e.g. ['M','Tu','W','Th','F','Sa','Su']
}

export interface DayHistory {
  date: string; // yyyy-MM-dd
  total: number;
  taken: number;
  medications: { id: string; name: string; icon: string; taken: boolean }[];
}

interface MedicationStore {
  medications: Medication[];
  lastResetDate: string | null; // yyyy-MM-dd of last daily reset
  history: DayHistory[]; // past day records for calendar
  addMedication: (medication: Omit<Medication, 'id' | 'taken' | 'takenAt' | 'reminderEnabled' | 'notificationIds' | 'days'> & { days?: string[] }) => void;
  removeMedication: (id: string) => void;
  markMedicationTaken: (id: string) => boolean;
  resetDaily: () => void;
  checkAndResetIfNewDay: () => void;
}

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useMedicationStore = create<MedicationStore>()(
  persist(
    (set, get) => ({
      medications: [],
      lastResetDate: null,
      history: [],

      addMedication: async (medication) => {
    const id = `med_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

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
        if (__DEV__) console.warn('[MedicationStore] Failed to schedule notifications:', e);
      }
    }

    set((state) => ({
      medications: [
        ...state.medications,
        {
          ...medication,
          id,
          days: medication.days ?? ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'],
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
        if (__DEV__) console.warn('[MedicationStore] Failed to cancel notifications:', e);
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
    // Save today's snapshot to history before resetting
    const meds = get().medications;
    const today = getTodayKey();
    const total = meds.length;
    const taken = meds.filter((m) => m.taken).length;

    if (total > 0) {
      const snapshot: DayHistory = {
        date: get().lastResetDate || today,
        total,
        taken,
        medications: meds.map((m) => ({ id: m.id, name: m.name, icon: m.icon, taken: m.taken })),
      };

      set((state) => {
        // Avoid duplicate history entries for the same date
        const filtered = state.history.filter((h) => h.date !== snapshot.date);
        // Keep last 90 days of history
        const trimmed = [...filtered, snapshot].slice(-90);
        return {
          history: trimmed,
          medications: state.medications.map((m) => ({
            ...m,
            taken: false,
            takenAt: null,
          })),
          lastResetDate: today,
        };
      });
    } else {
      set({ lastResetDate: today });
    }

    // Update badge count to total medications
    const totalMeds = get().medications.length;
    NotificationService.updateBadgeCount(totalMeds).catch(() => {});
  },

      checkAndResetIfNewDay: () => {
        const today = getTodayKey();
        const lastReset = get().lastResetDate;
        if (lastReset !== today) {
          get().resetDaily();
        }
      },
    }),
    {
      name: 'kawaii-meds-medications',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        medications: state.medications,
        lastResetDate: state.lastResetDate,
        history: state.history,
      }),
    }
  )
);
