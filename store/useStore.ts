import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationService } from '@/services/NotificationService';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: string[]; // e.g. ["8:00 AM", "8:00 PM"]
  imageUri?: string;
  stock: number;
  stockType?: string;
  color?: string;
}

interface AnalyticsEntry {
  slot: string;
  takenAt: string;
  diffMinutes: number;
}

interface DailyLog {
  [date: string]: {
    [medId: string]: string[]
  };
}

interface AnalyticsLog {
  [medId: string]: AnalyticsEntry[];
}

interface Settings {
  voiceEnabled: boolean;
  englishEnabled: boolean;
  voiceLanguage: string;
  appLanguage: 'en' | 'ur';

  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;

  textScale: 1 | 1.25 | 1.5 | 1.75;
  simplifiedMode: boolean;

  userName: string;
  userPhoto: string | null;
}

interface MedState {
  medicines: Medicine[];
  logs: DailyLog;
  analytics: AnalyticsLog;
  settings: Settings;

  addMedicine: (med: Medicine) => void;
  updateMedicine: (id: string, updatedData: Partial<Medicine>) => void; // NEW: Edit
  removeMedicine: (id: string) => void;
  toggleDose: (id: string, timeSlot: string) => void; // NEW: Specific Dose
  getDoseStatus: (id: string, timeSlot: string) => boolean; // NEW: Check specific dose
  getTakenCount: (id: string) => number; 
  checkAdherence: (id: string) => string | null;

  updateSettings: (newSettings: Partial<Settings>) => void;
  resetAllData: () => void;
}

export const useStore = create<MedState>()(
  persist(
    (set, get) => ({
      medicines: [],
      logs: {},
      analytics: {},
      settings: {
        voiceEnabled: true,
        englishEnabled: true,
        voiceLanguage: 'hi-IN',
        appLanguage: 'en',
        theme: 'system',
        highContrast: false,
        textScale: 1,
        simplifiedMode: false,
        userName: 'Guest User',
        userPhoto: null,
      },

      addMedicine: (med) => {
        set((state) => ({
          medicines: [...state.medicines, med]
        }))
        NotificationService.scheduleMedicationReminder(med);
      },

      updateMedicine: (id, updatedData) => {
        set((state) => {
          const updatedMeds = state.medicines.map((m) => {
            if (m.id === id) {
              const newMed = { ...m, ...updatedData };
              // Reschedule with new times/details
              NotificationService.scheduleMedicationReminder(newMed);
              return newMed;
            }
            return m;
          });
          return { medicines: updatedMeds };
        });
      },

      removeMedicine: (id) => {
        set((state) => ({
          medicines: state.medicines.filter((m) => m.id !== id)
        }));
        // Kill all alarms for this med
        NotificationService.cancelAllForMed(id);
      },

      toggleDose: (id, timeSlot) => {
        const now = new Date();
        const todayStr = new Date().toISOString().split('T')[0];

        set((state) => {
          const dayLog = state.logs[todayStr] || {};
          const takenSlots = dayLog[id] || [];
          const medAnalytics = state.analytics[id] || [];

          let newSlots;
          let newAnalytics = [...medAnalytics]
          let stockChange = 0;

          if (takenSlots.includes(timeSlot)) {
            newSlots = takenSlots.filter(t => t !== timeSlot);
            stockChange = 1;
            newAnalytics = newAnalytics.filter(a => !(a.slot === timeSlot && a.takenAt.startsWith(todayStr))); const med = get().medicines.find(m => m.id === id);
            if (med) NotificationService.rescheduleLateReminder(med);
          } else {
            newSlots = [...takenSlots, timeSlot];
            stockChange = -1;
            
            NotificationService.cancelLateReminder(id, timeSlot);
            
            const [time, period] = timeSlot.split(' ')
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);

            const diffMs = now.getTime() - scheduledTime.getTime();
            const diffMinutes = Math.round(diffMs / 60000);

            newAnalytics.push({
              slot: timeSlot,
              takenAt: now.toISOString(),
              diffMinutes: diffMinutes,
            });
          }

          return {
            logs: {
              ...state.logs,
              [todayStr]: { ...dayLog, [id]: newSlots }
            },
            medicines: state.medicines.map(m =>
              m.id === id ? { ...m, stock: m.stock + stockChange } : m
            ),
            analytics: { ...state.analytics, [id]: newAnalytics }
          };
        });
      },

      getDoseStatus: (id, timeSlot) => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const takenSlots = state.logs[today]?.[id] || [];
        return takenSlots.includes(timeSlot) || false;
      },

      getTakenCount: (id) => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        return state.logs[today]?.[id]?.length || 0;
      },

      checkAdherence: (id) => {
        const history = get().analytics[id] || [];
        if (history.length < 3) return null;

        const last3 = history.slice(-3);
        const avgDiff = last3.reduce((acc, curr) => acc + curr.diffMinutes, 0) / 3;

        if (avgDiff > 30) return "You consistently take this ~30 minutes late. Change schedule?";
        if (avgDiff < -30) return "You consistently take this ~30 minutes early. Change schedule?";
        return null;
      },

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      resetAllData: async () => {
        const meds = get().medicines;
        for (const med of meds) {
          await NotificationService.cancelAllForMed(med.id);
        }

        set({medicines: [], logs: {}, analytics: {}});
      }
    }),
    {
      name: 'dawaai-storage-v5',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);