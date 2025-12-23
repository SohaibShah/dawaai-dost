import React, { useEffect } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import LocalizedText from './LocalizedText';
import { useAlertStore } from '../store/alertStore';
import { MotiView } from 'moti';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react-native';
import { VoiceService } from '@/services/VoiceService';
import { useLocalization } from '@/utils/useLocalization';
import { getLocalizedTTS } from '@/utils/localization';
import { transliterateUrduToHindi } from '@/utils/transliterate';

const ICONS = {
  success: { icon: CheckCircle, color: '#22C55E', bg: 'bg-success-bg dark:bg-dark-success-bg' },
  error: { icon: XCircle, color: '#FB7185', bg: 'bg-error-bg dark:bg-dark-error-bg' },
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'bg-warning-bg dark:bg-dark-warning-bg' },
  info: { icon: Info, color: '#0EA5E9', bg: 'bg-surface-highlight dark:bg-dark-surface-highlight' },
};

export default function GlobalAlert() {
  const { language } = useLocalization();
  const { 
    visible, title, message, type, 
    onConfirm, confirmText, 
    onCancel, cancelText,
    onNeutral, neutralText,
    secondaryTitle, secondaryMessage,
    secondaryConfirmText, secondaryCancelText, secondaryNeutralText,
    hideAlert 
  } = useAlertStore();

  useEffect(() => {
    if (!visible) return;

    // Build TTS for both languages using the new structure:
    // "Alert!" "{title}" "{message}" "First Option: {confirmText}" etc.
    
    // English speech
    const enAlert = getLocalizedTTS('alert', 'en');
    const enTitle = title || '';
    const enMessage = message || '';
    const enFirstOpt = confirmText ? `${getLocalizedTTS('first_option', 'en')}: ${confirmText}` : '';
    const enSecondOpt = cancelText ? `${getLocalizedTTS('second_option', 'en')}: ${cancelText}` : '';
    const enThirdOpt = neutralText ? `${getLocalizedTTS('third_option', 'en')}: ${neutralText}` : '';
    
    const englishSpeech = [enAlert, enTitle, enMessage, enFirstOpt, enSecondOpt, enThirdOpt]
      .filter(Boolean)
      .join('. ');

    // Urdu/Hindi speech (uses Urdu display but transliterates to Hindi for TTS)
    const urAlert = transliterateUrduToHindi(getLocalizedTTS('alert', 'ur'));
    const urTitle = transliterateUrduToHindi(secondaryTitle || title || '');
    const urMessage = transliterateUrduToHindi(secondaryMessage || message || '');
    const urFirstOpt = (secondaryConfirmText || confirmText) 
      ? `${transliterateUrduToHindi(getLocalizedTTS('first_option', 'ur'))}: ${transliterateUrduToHindi((secondaryConfirmText || confirmText) ?? '')}` 
      : '';
    const urSecondOpt = (secondaryCancelText || cancelText) 
      ? `${transliterateUrduToHindi(getLocalizedTTS('second_option', 'ur'))}: ${transliterateUrduToHindi((secondaryCancelText || cancelText) ?? '')}` 
      : '';
    const urThirdOpt = (secondaryNeutralText || neutralText) 
      ? `${transliterateUrduToHindi(getLocalizedTTS('third_option', 'ur'))}: ${transliterateUrduToHindi((secondaryNeutralText || neutralText) ?? '')}` 
      : '';
    
    const hindiSpeech = [urAlert, urTitle, urMessage, urFirstOpt, urSecondOpt, urThirdOpt]
      .filter(Boolean)
      .join('. ');

    VoiceService.speakDual(englishSpeech, hindiSpeech);
  }, [visible, title, message, confirmText, cancelText, neutralText, secondaryTitle, secondaryMessage, secondaryConfirmText, secondaryCancelText, secondaryNeutralText, language]);

  if (!visible) return null;

  const ThemeIcon = ICONS[type] || ICONS.info;
  const IconComponent = ThemeIcon.icon;

  const handleAction = (action?: () => void) => {
    if (action) action();
    hideAlert();
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className="flex-1 bg-black/70 items-center justify-center p-6">
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="bg-surface dark:bg-dark-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-border dark:border-dark-border"
        >
          <View className="flex-row justify-between items-start">
             <View className={`p-3 rounded-full mb-4 ${ThemeIcon.bg}`}>
               <IconComponent size={28} color={ThemeIcon.color} />
             </View>
             <TouchableOpacity onPress={hideAlert} className="p-2">
                <X size={20} color="#94A3B8" />
             </TouchableOpacity>
          </View>

          <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main mb-2">{title}</LocalizedText>
          <LocalizedText className="text-text-muted dark:text-dark-text-muted mb-6 leading-5">{message}</LocalizedText>

          <View className="gap-3">
            <TouchableOpacity 
              onPress={() => handleAction(onConfirm)}
              className={`w-full py-3.5 rounded-xl items-center shadow-sm ${type === 'error' ? 'bg-error dark:bg-dark-error' : 'bg-primary dark:bg-dark-primary'}`}
            >
              <LocalizedText className="font-bold text-white text-base">
                {confirmText || 'OK'}
              </LocalizedText>
            </TouchableOpacity>

            {onCancel && (
              <TouchableOpacity 
                onPress={() => handleAction(onCancel)}
                className="w-full py-3.5 rounded-xl bg-surface-highlight dark:bg-dark-surface-highlight border border-border dark:border-dark-border items-center"
              >
                <LocalizedText className={`font-semibold text-base ${type === 'info' ? 'text-error dark:text-dark-error' : 'text-text-main dark:text-dark-text-main'}`}>
                  {cancelText}
                </LocalizedText>
              </TouchableOpacity>
            )}

            {onNeutral && (
              <TouchableOpacity 
                onPress={() => handleAction(onNeutral)}
                className="w-full py-2 items-center mt-1"
              >
                <LocalizedText className="font-medium text-text-muted dark:text-dark-text-muted">{neutralText || "Cancel"}</LocalizedText>
              </TouchableOpacity>
            )}
          </View>

        </MotiView>
      </View>
    </Modal>
  );
}