import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, Switch, FlatList, TextInput } from 'react-native';
import { useStore } from '../store/useStore';
import { useLocalization } from '../utils/useLocalization';
import { X, Search, Check, Download, ChevronRight } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import LocalizedText from './LocalizedText';
import { MotiView } from 'moti';

// Supported app languages with TTS models
const SUPPORTED_VOICE_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', label: 'English' },
  { code: 'hi-IN', name: 'Hindi (India)', label: 'Urdu/Hindi' },
];

export default function VoiceSettingsModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const { settings, updateSettings } = useStore();
  const { t } = useLocalization();
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string | null>(null);
  const [availableVoicesForLang, setAvailableVoicesForLang] = useState<Speech.Voice[]>([]);

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then(v => {
      setVoices(v); 
    });
  }, []);

  useEffect(() => {
    if (selectedLanguageCode) {
      const voicesForLang = voices.filter(v => v.language.startsWith(selectedLanguageCode));
      setAvailableVoicesForLang(voicesForLang);
    }
  }, [selectedLanguageCode, voices]);

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-background dark:bg-dark-background pt-12 px-6">
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <LocalizedText sizeClass="text-3xl" className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail" marquee>
            {selectedLanguageCode ? t('select_voice') : t('voice_assistant')}
          </LocalizedText>
          <TouchableOpacity onPress={onClose} className="bg-surface-highlight dark:bg-dark-surface-highlight p-2 rounded-full border border-border/60 dark:border-dark-border/60">
            <X size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {!selectedLanguageCode ? (
          <>
            {/* Toggles */}
            <View className="bg-surface dark:bg-dark-surface p-4 rounded-2xl mb-6 shadow-sm border border-border dark:border-dark-border">
              
              <View className="flex-row justify-between items-center mb-4">
                <LocalizedText sizeClass="text-lg" className="font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('enable_voice_assistant')}</LocalizedText>
                <Switch 
                  value={settings.voiceEnabled} 
                  onValueChange={(v) => updateSettings({ voiceEnabled: v })} 
                  trackColor={{ true: '#0EA5E9' }}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <View className="min-w-0 flex-1">
                   <LocalizedText sizeClass="text-lg" className="font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('english_assistant')}</LocalizedText>
                   <LocalizedText sizeClass="text-xs" className="text-text-muted dark:text-dark-text-muted" numberOfLines={1} ellipsizeMode="tail">{t('speak_english_before_hindi')}</LocalizedText>
                </View>
                <Switch 
                  value={settings.englishEnabled} 
                  onValueChange={(v) => updateSettings({ englishEnabled: v })} 
                  trackColor={{ true: '#0EA5E9' }}
                />
              </View>
            </View>

            {/* Supported Languages List */}
            <LocalizedText className="text-text-muted dark:text-dark-text-muted font-bold text-xs uppercase mb-3">{t('select_voice_language')}</LocalizedText>
            
            {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
              <TouchableOpacity 
                key={lang.code}
                onPress={() => setSelectedLanguageCode(lang.code)}
                className={`p-4 mb-3 rounded-xl flex-row justify-between items-center ${settings.voiceLanguage === lang.code ? 'bg-primary/10 dark:bg-dark-primary/20 border border-primary/30 dark:border-dark-border' : 'bg-surface dark:bg-dark-surface border border-border/60 dark:border-dark-border/60'}`}
              >
                <View className="flex-1 min-w-0">
                  <LocalizedText className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{lang.code === 'en-US' ? t('english_us') : t('hindi_india')}</LocalizedText>
                  <LocalizedText sizeClass="text-xs" className="text-text-muted dark:text-dark-text-muted" numberOfLines={1} ellipsizeMode="tail">{lang.code === 'en-US' ? t('english') : t('urdu_hindi')}</LocalizedText>
                </View>
                <View className="flex-row items-center">
                  {settings.voiceLanguage === lang.code && <Check size={20} color="#0EA5E9" className="mr-2" />}
                  <ChevronRight size={20} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {/* Back Button and Voices List */}
            <TouchableOpacity 
              onPress={() => setSelectedLanguageCode(null)}
              className="mb-6 flex-row items-center"
            >
              <LocalizedText className="text-primary font-bold">{t('back')}</LocalizedText>
            </TouchableOpacity>

            {/* Install Voice Pack Option */}
            <TouchableOpacity className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-xl mb-6 flex-row items-center">
              <View className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg mr-3">
                <Download size={20} color="#0EA5E9" />
              </View>
              <View className="flex-1 min-w-0">
                <LocalizedText className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('install_voice_pack')}</LocalizedText>
                <LocalizedText sizeClass="text-xs" className="text-text-muted dark:text-dark-text-muted" numberOfLines={1} ellipsizeMode="tail">{t('download_for_offline')}</LocalizedText>
              </View>
              <ChevronRight size={20} color="#0EA5E9" />
            </TouchableOpacity>

            {/* Available Voices */}
            <LocalizedText className="text-text-muted dark:text-dark-text-muted font-bold uppercase mb-3" sizeClass="text-xs">{t('available_voices')}</LocalizedText>
            
            {availableVoicesForLang.length > 0 ? (
              <FlatList
                data={availableVoicesForLang}
                keyExtractor={(item) => item.identifier}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => updateSettings({ voiceLanguage: item.language })}
                    className={`p-4 mb-2 rounded-xl flex-row justify-between items-center ${settings.voiceLanguage === item.language ? 'bg-primary/10 dark:bg-dark-primary/20 border border-primary/30 dark:border-dark-border' : 'bg-surface dark:bg-dark-surface border border-border/60 dark:border-dark-border/60'}`}
                  >
                    <View className="min-w-0 flex-1">
                      <LocalizedText className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{item.name}</LocalizedText>
                      <LocalizedText sizeClass="text-xs" className="text-text-muted dark:text-dark-text-muted" numberOfLines={1} ellipsizeMode="tail">{item.language}</LocalizedText>
                    </View>
                    {settings.voiceLanguage === item.language && <Check size={20} color="#0EA5E9" />}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View className="bg-surface dark:bg-dark-surface p-6 rounded-xl items-center">
                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-center">{t('no_voices_available')}</LocalizedText>
              </View>
            )}
          </>
        )}

      </View>
    </Modal>
  );
}