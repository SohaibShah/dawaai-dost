import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SpotlightTarget {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

type TargetKey = 'addButton' | 'dosePill' | 'medicineCard' | 'suggestionBanner';

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  showOnboarding: boolean;
  targets: Partial<Record<TargetKey, SpotlightTarget>>;

  setCompleted: (completed: boolean) => void;
  setCurrentStep: (step: number) => void;
  setShowOnboarding: (show: boolean) => void;
  startOnboarding: () => void;
  resetOnboarding: () => void;

  setTarget: (key: TargetKey, target: SpotlightTarget) => void;
  setTargetIfEmpty: (key: TargetKey, target: SpotlightTarget) => void;
  clearTargets: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      completed: false,
      currentStep: 0,
      showOnboarding: false,
      targets: {},

      setCompleted: (completed) => set({ completed }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setShowOnboarding: (show) => set({ showOnboarding: show }),

      startOnboarding: () => set({ showOnboarding: true, currentStep: 0 }),

      resetOnboarding: () => set({ 
        completed: false, 
        currentStep: 0, 
        showOnboarding: true,
        targets: {}
      }),

      setTarget: (key, target) => set((state) => ({ targets: { ...state.targets, [key]: target } })),
      setTargetIfEmpty: (key, target) => {
        const existing = get().targets[key];
        if (!existing) {
          set((state) => ({ targets: { ...state.targets, [key]: target } }));
        }
      },
      clearTargets: () => set({ targets: {} }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
