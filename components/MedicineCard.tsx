import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import LocalizedText from './LocalizedText';
import { MotiView, AnimatePresence } from 'moti';
import { Check, AlertCircle, Volume2, Zap, ChevronDown } from 'lucide-react-native';
import { Layout } from 'react-native-reanimated';
import { VoiceService } from '../services/VoiceService';
import { useLocalization } from '@/utils/useLocalization';
import { useTextScale } from '@/utils/useTextScale';
import { useStore } from '../store/useStore'; // Need store to check specific doses
import * as Speech from 'expo-speech';

interface Props {
  med: any;
  onLongPress: () => void;
  onDosePress: (time: string, isTaken: boolean) => void; // Trigger modal for specific dose
  suggestion?: { text: string; onEdit: () => void };
  isDarkMode?: boolean;
}

const TIME_STYLES = {
  morning:   { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-100', border: 'border-orange-200 dark:border-orange-800' },
  afternoon: { bg: 'bg-yellow-100 dark:bg-amber-900', text: 'text-yellow-800 dark:text-amber-100', border: 'border-yellow-200 dark:border-amber-800' },
  evening:   { bg: 'bg-blue-100 dark:bg-blue-900',   text: 'text-blue-800 dark:text-blue-100',   border: 'border-blue-200 dark:border-blue-800' },
  night:     { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-100', border: 'border-indigo-200 dark:border-indigo-800' },
};

export default function MedicineCard({ med, onLongPress, onDosePress, suggestion, isDarkMode }: Props) {
  const { t, getDualTTS } = useLocalization();
  const { settings } = useStore();
  const { getScaledSize } = useTextScale();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const getDoseStatus = useStore(state => state.getDoseStatus);
  const getTakenCount = useStore(state => state.getTakenCount);
  
  // Calculate Progress
  const totalSlots = med.timeSlots.length;
  const takenCount = getTakenCount(med.id);
  const isFullyComplete = takenCount === totalSlots;

  const handleSpeak = () => {
    setIsSpeaking(true);
    const { en, hi } = getDualTTS('medicine');
    const { en: enDosage, hi: hiDosage } = getDualTTS('dosage');
    VoiceService.speakDual(`${en}: ${med.name}; ${enDosage}: ${med.dosage}`, `${hi}: ${med.name}; ${hiDosage}: ${med.dosage}`);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const handleDosePress = (time: string, isTaken: boolean) => {
    // Audio confirmation when dose is marked taken/unmarked
    if (settings.voiceEnabled) {
      const confirmKey = !isTaken ? 'dose_marked_taken' : 'dose_unmarked';
      const confirmText = t(confirmKey);
      Speech.speak(confirmText, {
        language: settings.appLanguage === 'ur' ? 'hi-IN' : 'en-US',
        rate: 0.9,
      });
    }
    onDosePress(time, isTaken);
  };

  return (
    <MotiView
      layout={Layout.springify()} 
      animate={{ 
        scale: isFullyComplete ? 0.98 : 1,
      }}
      className={`mb-4 rounded-3xl border-2 shadow-sm overflow-hidden bg-surface dark:bg-dark-surface ${isFullyComplete ? 'border-border dark:border-dark-border opacity-60' : 'border-border dark:border-dark-border'}`}
    >
      <TouchableOpacity 
        onLongPress={onLongPress}
        delayLongPress={500}
        activeOpacity={0.9}
        className="flex-row p-4 items-start"
      >
        {/* Visual ID */}
        <View className="h-24 w-24 rounded-2xl overflow-hidden mr-4 border border-border/60 dark:border-dark-border/60 relative mt-1 bg-surface-highlight dark:bg-dark-surface-highlight">
          {med.imageUri ? (
            <Image source={{ uri: med.imageUri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="flex-1 items-center justify-center bg-blue-100 dark:bg-dark-surface-highlight"><LocalizedText className="text-3xl">💊</LocalizedText></View>
          )}
          {isFullyComplete && (
            <View className="absolute inset-0 bg-emerald-500/80 items-center justify-center">
              <Check color="white" size={40} strokeWidth={4} />
            </View>
          )}
        </View>

        {/* Details */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2 min-w-0">
              <LocalizedText 
                sizeClass="text-xl"
                style={{ fontWeight: 'bold' }}
                className="text-text-main dark:text-dark-text-main"
                numberOfLines={1}
                marquee
              >
                {med.name}
              </LocalizedText>
              <LocalizedText 
                sizeClass="text-sm"
                style={{ fontWeight: '500' }}
                className="text-text-muted dark:text-dark-text-muted"
                numberOfLines={1}
                marquee
              >
                {med.dosage}
              </LocalizedText>
            </View>
            <TouchableOpacity onPress={handleSpeak} className={`p-2 rounded-full ${isSpeaking ? 'bg-primary dark:bg-dark-primary' : 'bg-surface-highlight dark:bg-dark-surface-highlight'}`}>
               <Volume2 size={20} color={isSpeaking ? 'white' : '#0EA5E9'} />
            </TouchableOpacity>
          </View>

          {/* INTERACTIVE PILLS */}
          <View className="flex-row flex-wrap gap-2 mt-2">
            {med.timeSlots.map((time: string, i: number) => {
              const isTaken = getDoseStatus(med.id, time);
              const timeKey = VoiceService.getTimeColorKey(time);
              const style = TIME_STYLES[timeKey];
              const displayTime = VoiceService.formatTime({ timeString: time });

              return (
                <TouchableOpacity 
                  key={i}
                  onPress={() => handleDosePress(time, isTaken)} // Single-tap to toggle dose (simplified gesture)
                  className={`px-3 py-2 rounded-full border flex-row items-center ${
                    isTaken 
                      ? 'bg-emerald-500 border-emerald-600' // Taken Style
                      : `${style.bg} ${style.border}`         // Pending Style
                  }`}
                >
                  {isTaken ? (
                    <MotiView from={{ scale: 0 }} animate={{ scale: 1 }}>
                       <Check size={14} color="white" strokeWidth={4} />
                    </MotiView>
                  ) : (
                    <LocalizedText 
                      sizeClass="text-sm"
                      style={{ fontWeight: 'bold' }}
                      className={style.text}
                      numberOfLines={1}
                    >
                      {displayTime}
                    </LocalizedText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>

      {/* EXPANDABLE SUGGESTION DROPDOWN - Hidden in simplified mode */}
      {suggestion && !settings.simplifiedMode && (
        <View>
          <TouchableOpacity 
            onPress={() => setIsExpanded(!isExpanded)}
            className="flex-row items-center justify-between px-4 py-3 border-t border-border dark:border-dark-border"
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                <Zap size={16} color={isDarkMode ? '#d8b4fe' : '#9333EA'} />
              </View>
              <View className="flex-1">
                <LocalizedText className="font-bold text-text-main dark:text-dark-text-main text-sm">{t('smart_tip')}</LocalizedText>
              </View>
            </View>
            <MotiView
              animate={{ rotate: isExpanded ? '180deg' : '0deg' }}
              transition={{ type: 'timing', duration: 200 }}
            >
              <ChevronDown size={20} color="#94A3B8" />
            </MotiView>
          </TouchableOpacity>

          <AnimatePresence>
            {isExpanded && (
              <MotiView
                from={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'timing', duration: 250 }}
                className="overflow-hidden"
              >
                <View className="px-4 py-3 border-t border-border/50 dark:border-dark-border/50 bg-purple-50 dark:bg-purple-950/20">
                  <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs leading-4 mb-3">{suggestion.text}</LocalizedText>
                  <TouchableOpacity onPress={suggestion.onEdit} className="bg-primary active:bg-primary/80 px-3 py-1.5 rounded-lg self-start">
                    <LocalizedText className="text-white font-bold text-xs">{t('edit_medicine')}</LocalizedText>
                  </TouchableOpacity>
                </View>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      )}
    </MotiView>
  );
}