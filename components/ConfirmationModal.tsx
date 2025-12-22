import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import LocalizedText from './LocalizedText';
import { MotiView, MotiText } from 'moti';
import { Check, X } from 'lucide-react-native';
import { VoiceService } from '../services/VoiceService';
import { useLocalization } from '@/utils/useLocalization';
import { useStore } from '@/store/useStore';
import * as Speech from 'expo-speech';
import { hapticDoubleTap, hapticTap, hapticSuccess } from '@/utils/haptics';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  med: any;
  isTaken: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ visible, med, onConfirm, onCancel, isTaken }: Props) {
  const { t, getDualTTS } = useLocalization();
  const { settings } = useStore();
  const [confirmClicks, setConfirmClicks] = useState(0);
  const [cancelClicks, setCancelClicks] = useState(0);

  // Reset clicks when modal opens
  useEffect(() => {
    if (visible) {
      setConfirmClicks(0);
      setCancelClicks(0);
      if (med) {
        if (!isTaken) {
          const { en, hi } = getDualTTS('have_you_taken');
          VoiceService.speakDual(en.replace('{name}', med.name), hi.replace('{name}', med.name));
        } else {
          const { en, hi } = getDualTTS('unmark_question');
          VoiceService.speakDual(en.replace('{name}', med.name), hi.replace('{name}', med.name));
        }
      }
    }
  }, [visible, med]);

  if (!visible || !med) return null;

  const handleConfirmPress = () => {
    if (confirmClicks === 0) {
      setConfirmClicks(1);
      const { en, hi } = getDualTTS('press_again');
      VoiceService.speakDual(en, hi);
    } else {
      const confirmKey = !isTaken ? 'dose_marked_taken' : 'dose_unmarked';
      hapticSuccess();

      if (settings.voiceEnabled) {
        const { en, hi } = getDualTTS(confirmKey);
        const targetLang = settings.voiceLanguage || 'hi-IN';
        const speakTarget = () => Speech.speak(hi, { language: targetLang, rate: 0.9, onDone: onConfirm });

        if (settings.englishEnabled) {
          Speech.speak(en, {
            language: 'en-US',
            rate: 0.9,
            onDone: speakTarget,
          });
        } else {
          speakTarget();
        }
      } else {
        onConfirm();
      }
    }
  };

  const handleCancelPress = () => {
    if (cancelClicks === 0) {
      setCancelClicks(1);
      const { en, hi } = getDualTTS('press_again');
      VoiceService.speakDual(en, hi);
    } else {
      hapticTap();
      onCancel();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/50 items-center justify-end">
        
        <MotiView 
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300 }} // Smooth, no bounce
          className="bg-surface dark:bg-dark-surface w-full rounded-3xl items-center shadow-2xl overflow-hidden p-6 border border-border dark:border-dark-border"
          style={{ maxHeight: height * 0.85 }}
        >
          <View className="w-64 h-64 bg-surface-highlight dark:bg-dark-surface-highlight rounded-3xl mb-6 shadow-inner border-4 border-surface dark:border-dark-border overflow-hidden">
            {med.imageUri ? (
              <Image source={{ uri: med.imageUri }} className="w-full h-full" resizeMode="stretch" />
            ) : (
              <View className="flex-1 items-center justify-center"><LocalizedText className="text-6xl">💊</LocalizedText></View>
            )}
          </View>

          <LocalizedText sizeClass="text-3xl" className="font-bold text-text-main dark:text-dark-text-main text-center mb-2" numberOfLines={1} ellipsizeMode="tail" marquee>
            {isTaken ? t('confirm_dose_removal') : t('confirm_dose')}
          </LocalizedText>
          <LocalizedText sizeClass="text-lg" className="text-text-muted dark:text-dark-text-muted text-center mb-8 px-4" numberOfLines={1} ellipsizeMode="tail" marquee>
            {isTaken ? t('unmark_as_taken').replace('{name} ', '') : t('mark_as_taken').replace('{name} ', '')} <LocalizedText className="font-bold text-primary dark:text-dark-primary">{med.name}</LocalizedText>
          </LocalizedText>

          {/* Buttons with Double Press Logic */}
          <View className="w-full gap-4">
            
            {/* YES BUTTON */}
            <TouchableOpacity 
              onPress={handleConfirmPress}
              activeOpacity={0.9}
              className={`${
                confirmClicks === 1 ? isTaken ? `bg-rose-600 scale-105` : `bg-emerald-600 scale-105` : isTaken ? `bg-rose-500` : `bg-emerald-500`
                } w-full py-6 rounded-3xl flex-row items-center justify-center shadow-lg transition-all`}
            >
              <Check color="white" size={36} strokeWidth={4} />
              <View>
                <LocalizedText sizeClass="text-2xl" className="text-white font-bold text-center ml-3" numberOfLines={1} ellipsizeMode="tail">
                  {confirmClicks === 1 ? t('press_again') : (isTaken ? t('yes_remove') : t('yes_taken'))}
                </LocalizedText>
              </View>
            </TouchableOpacity>

            {/* NO BUTTON */}
            <TouchableOpacity 
              onPress={handleCancelPress}
              activeOpacity={0.9}
              className={`${cancelClicks === 1 ? 'bg-surface-highlight dark:bg-dark-surface-highlight' : 'bg-surface dark:bg-dark-surface'} w-full py-6 rounded-3xl flex-row items-center justify-center transition-all border border-border/60 dark:border-dark-border/60`}
            >
              <X color="#94A3B8" size={32} strokeWidth={4} />
              <View className="min-w-0">
                <LocalizedText sizeClass="text-xl" className="ml-3 text-text-main dark:text-dark-text-main font-bold text-center" numberOfLines={1} ellipsizeMode="tail">
                  {cancelClicks === 1 ? t('press_again') : t('no_cancel')}
                </LocalizedText>
              </View>
            </TouchableOpacity>

          </View>
        </MotiView>
      </View>
    </Modal>
  );
}