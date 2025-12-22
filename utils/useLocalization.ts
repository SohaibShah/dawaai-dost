import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useStore } from '@/store/useStore';
import { getString, getTTSString, Language, STRINGS } from './localization';
import { transliterateMedicineName } from './transliterate';

export function useLocalization() {
  const appLanguage = useStore((state) => state.settings.appLanguage);

  return useMemo(() => ({
    language: appLanguage,
    t: (key: string) => getString(key, appLanguage),
    tts: (key: string) => getTTSString(key, appLanguage),
    isUrdu: appLanguage === 'ur',
    // Get font family based on current language (auto switches on language change)
    getFontFamily: () => {
      if (appLanguage === 'ur') {
        // Use system fonts that support Arabic/Urdu script
        return Platform.OS === 'ios' ? 'Arial' : 'sans-serif';
      }
      return undefined; // Use default system font for English
    },
    // Get text direction (RTL for Urdu, LTR for English)
    getTextDirection: () => appLanguage === 'ur' ? 'rtl' : 'ltr',
    // Helper for voice announcements that need both English and Hindi
    getDualTTS: (key: string): { en: string; hi: string } => {
      const enTTS = STRINGS[key]?.en?.tts || STRINGS[key]?.en?.text || key;
      const hiTTS = STRINGS[key]?.ur?.tts || STRINGS[key]?.ur?.text || key;
      return { en: enTTS, hi: hiTTS };
    },
    // Transliterate medicine names to Urdu when in Urdu mode
    getMedicineName: (name: string): string => {
      if (appLanguage === 'ur') {
        return transliterateMedicineName(name);
      }
      return name;
    },
  }), [appLanguage]);
}
