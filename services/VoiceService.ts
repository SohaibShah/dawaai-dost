import * as Speech from 'expo-speech';
import { useStore } from '@/store/useStore';
import { Platform, Linking, Alert } from 'react-native';

export type TimeFormatParams = { timeString?: string; time?: Date; };

const parseTime = (timeString: string): Date => {
  if (!timeString) return new Date();

  const d = new Date(timeString);
  if (!isNaN(d.getTime())) return d;

  const today = new Date();
  const match = timeString.match(/(\d+):(\d+)\s?(AM|PM)?/i);

  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3]?.toUpperCase();

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    today.setHours(hours, minutes, 0, 0);
    return today;
  }

  return today;
};

export const VoiceService = {
  
  getAvailableVoices: async () => {
    return await Speech.getAvailableVoicesAsync();
  },

  openTTSSetting: () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('com.android.settings.TTS_SETTINGS');
    }
  },
  
  speakDual: (englishText: string, targetLangText: string) => {
    const { settings } = useStore.getState();
    const targetLang = settings.voiceLanguage || 'hi-IN';
    
    const isVoiceEnabled = useStore.getState().settings.voiceEnabled
    if (!isVoiceEnabled) return;
    
    Speech.stop();
    
    const speakTargetLang = () => {
      Speech.speak(targetLangText, {
        language: targetLang,
        rate: 0.85,
        onError: (e) => {
          if (Platform.OS === 'android') {
            Alert.alert(
               "Voice Missing", 
               "Your phone doesn't have the selected voice installed.",
               [
                 { text: "Cancel" },
                 { text: "Install", onPress: () => VoiceService.openTTSSetting() }
               ]
             );
          }
        }
      })
    }

    if (settings.englishEnabled) {
      Speech.speak(englishText, {
        language: 'en-US',
        rate: 0.9,
        onDone: speakTargetLang
      });
    } else {
      speakTargetLang();
    }
  },

  stop: () => Speech.stop(),

  formatTime: ({ timeString, time }: TimeFormatParams): string => {
    let date: Date;
    if (time) {
      date = time;
    } else if (timeString) {
      date = parseTime(timeString);
    } else {
      date = new Date();
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${strMinutes} ${ampm}`;
  },

  getUrduTimePhrase: ({ timeString, time }: TimeFormatParams) => {
    let date: Date;
    if (time) {
      date = time;
    } else if (timeString) {
      date = parseTime(timeString);
    } else {
      date = new Date();
    }

    const hour = date.getHours();
    const minute = date.getMinutes();

    let period = "सुबह";
    if (hour >= 12 && hour < 17) period = "दुपहर"; // Afternoon
    if (hour >= 17 && hour < 20) period = "शाम"; // Evening
    if (hour >= 20 || hour < 5) period = "रात"; // Night

    const displayHour = hour % 12 || 12;

    return minute !== 0 
      ? `${period} ${displayHour} बजकर ${minute} मिनट` 
      : `${period} ${displayHour} बजे`;
  },

  getTimeColorKey: (timeString: string): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const date = parseTime(timeString);
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }
};