import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;

  secondaryTitle?: string;
  secondaryMessage?: string;
  secondaryConfirmText?: string;
  secondaryCancelText?: string;
  secondaryNeutralText?: string;
  
  onConfirm?: () => void;
  confirmText?: string;
  
  onCancel?: () => void;
  cancelText?: string;

  onNeutral?: () => void;
  neutralText?: string;
  
  showAlert: (params: { 
    title: string; 
    message: string; 
    type?: AlertType;
    onConfirm?: () => void; 
    confirmText?: string;
    onCancel?: () => void;
    cancelText?: string;
    onNeutral?: () => void;
    neutralText?: string;   // NEW
    secondaryTitle?: string;
    secondaryMessage?: string;
    secondaryConfirmText?: string;
    secondaryCancelText?: string;
    secondaryNeutralText?: string;
  }) => void;
  
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  type: 'info',
  
  showAlert: (params) => set({ 
    visible: true, 
    type: 'info',
    confirmText: 'OK',
    onConfirm: undefined,
    onCancel: undefined,
    onNeutral: undefined,
    cancelText: undefined, 
    neutralText: undefined,
    secondaryTitle: undefined,
    secondaryMessage: undefined,
    secondaryConfirmText: undefined,
    secondaryCancelText: undefined,
    secondaryNeutralText: undefined,
    ...params 
  }),
  
  hideAlert: () => set({ visible: false })
}));