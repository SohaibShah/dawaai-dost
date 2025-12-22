import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { useLocalization } from '@/utils/useLocalization';
import { X, Check, Globe } from 'lucide-react-native';
import LocalizedText from './LocalizedText';

// Supported app languages
const SUPPORTED_LANGUAGES = [
  { code: 'en' as const, name: 'English', nativeName: 'English', nameKey: 'english', nativeNameKey: 'english' },
  { code: 'ur' as const, name: 'Urdu', nativeName: 'اردو', nameKey: 'urdu', nativeNameKey: 'urdu' },
];

export default function LanguageSettingsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useStore();
  const { t } = useLocalization();

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-background dark:bg-dark-background pt-12 px-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <LocalizedText sizeClass="text-3xl" className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail" marquee>
            {t('language')}
          </LocalizedText>
          <TouchableOpacity
            onPress={onClose}
            className="bg-surface-highlight dark:bg-dark-surface-highlight p-2 rounded-full border border-border/60 dark:border-dark-border/60"
          >
            <X size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <LocalizedText className="text-text-muted dark:text-dark-text-muted mb-6" sizeClass="text-sm" numberOfLines={1} ellipsizeMode="tail">
          {t('choose_language')}
        </LocalizedText>

        {/* Language List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => {
                updateSettings({ appLanguage: lang.code });
                onClose();
              }}
              className={`p-5 mb-3 rounded-2xl flex-row items-center justify-between ${
                settings.appLanguage === lang.code
                  ? 'bg-primary/10 dark:bg-dark-primary/20 border-2 border-primary dark:border-dark-primary'
                  : 'bg-surface dark:bg-dark-surface border border-border dark:border-dark-border'
              }`}
            >
              <View className="flex-1 min-w-0">
                <LocalizedText
                  sizeClass="text-lg"
                  className={`font-bold ${
                    settings.appLanguage === lang.code
                      ? 'text-primary dark:text-dark-primary'
                      : 'text-text-main dark:text-dark-text-main'
                  }`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t(lang.nameKey)}
                </LocalizedText>
                <LocalizedText className="text-text-muted dark:text-dark-text-muted mt-1" sizeClass="text-sm" numberOfLines={1} ellipsizeMode="tail">
                  {t(lang.nativeNameKey)}
                </LocalizedText>
              </View>
              {settings.appLanguage === lang.code && (
                <View className="bg-primary dark:bg-dark-primary rounded-full p-2">
                  <Check size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
