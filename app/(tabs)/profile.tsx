import React, { useState } from 'react';
import { View, TouchableOpacity, Switch, Alert, Image, ScrollView } from 'react-native';
import LocalizedText from '@/components/LocalizedText';
import { useStore } from '@/store/useStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAlertStore } from '@/store/alertStore';
import { useLocalization } from '@/utils/useLocalization';
import { useTextScale } from '@/utils/useTextScale';
import AnimatedScreen from '@/components/AnimatedScreen';
import { User, Volume2, Trash2, ShieldCheck, Camera, Moon, Sun, Settings as SettingsIcon, ChevronRight, Globe, Maximize2, Eye, Minimize2, BookOpen } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import VoiceSettingsModal from '@/components/VoiceSettingsModal';
import EditProfileModal from '@/components/EditProfileModal';
import LanguageSettingsModal from '@/components/LanguageSettingsModal';

export default function ProfileScreen() {
  const { settings, updateSettings, resetAllData, medicines } = useStore();
  const { resetOnboarding } = useOnboardingStore();
  const { showAlert } = useAlertStore();
  const { t } = useLocalization();
  const { textScale, getScaledSize } = useTextScale();
  const [isVoiceModalVisible, setVoiceModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const handleReset = () => {
    showAlert({
      title: t('reset_confirmation'),
      message: t('reset_confirmation'),
      type: "error",
      onConfirm: () => resetAllData(),
      confirmText: t('delete'),
      onCancel: () => { },
      cancelText: t('cancel'),
      secondaryTitle: 'आप निश्चित हैं?',
      secondaryMessage: 'क्या आप सभी डेटा हटाना चाहते हैं?',
      secondaryConfirmText: 'हटाएं',
      secondaryCancelText: 'रद्द करें',
    });
  };

  const handleReplayTutorial = () => {
    resetOnboarding();
  };

  const cycleTheme = () => {
    const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(settings.theme) + 1) % modes.length;
    updateSettings({ theme: modes[nextIndex] });
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background pt-16 px-6">
      <AnimatedScreen>
        <LocalizedText className="text-3xl font-bold text-text-main dark:text-dark-text-main mb-6">{t('settings')}</LocalizedText>

        {/* 1. PROFILE CARD */}
        <TouchableOpacity
          onPress={() => setProfileModalVisible(true)}
          className="bg-surface dark:bg-dark-surface p-6 rounded-3xl mb-6 flex-row items-center shadow-sm border border-border dark:border-dark-border"
        >
          <View className="h-16 w-16 rounded-full bg-surface-highlight dark:bg-dark-surface-highlight items-center justify-center overflow-hidden border-2 border-primary mr-4">
            {settings.userPhoto ? (
              <Image source={{ uri: settings.userPhoto }} className="h-full w-full" />
            ) : (
              <User size={32} color="#94A3B8" />
            )}
          </View>
          <View className="flex-1 min-w-0">
            <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">
              {settings.userName}
            </LocalizedText>
            <LocalizedText className="text-primary font-bold text-sm" numberOfLines={1} ellipsizeMode="tail">
              {t('tap_to_edit_profile')}
            </LocalizedText>
          </View>
          <ChevronRight size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 2. THEME SWITCHER */}
          <TouchableOpacity onPress={cycleTheme} className="bg-surface dark:bg-dark-surface p-5 rounded-2xl mb-4 flex-row items-center justify-between border border-border dark:border-dark-border">
            <View className="flex-row items-center">
              <View className="bg-purple-50 dark:bg-dark-surface-highlight p-2.5 rounded-xl mr-4">
                {settings.theme === 'dark' ? <Moon size={20} color="#9333EA" /> : <Sun size={20} color="#F59E0B" />}
              </View>
              <View className="min-w-0">
                <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('app_theme')}</LocalizedText>
                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs capitalize" numberOfLines={1} ellipsizeMode="tail">{t(settings.theme === 'dark' ? 'dark_mode' : settings.theme === 'light' ? 'light_mode' : 'system_mode')}</LocalizedText>
              </View>
            </View>
            <View className="bg-surface-highlight dark:bg-dark-surface-highlight px-3 py-1 rounded-full border border-border/60 dark:border-dark-border/60">
              <LocalizedText className="text-xs font-bold text-text-muted dark:text-dark-text-muted capitalize">{settings.theme}</LocalizedText>
            </View>
          </TouchableOpacity>

          {/* 3. LANGUAGE SELECTOR */}
          <View className="bg-surface dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm border border-border dark:border-dark-border mb-6">
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(true)}
              className="flex-row items-center justify-between p-5"
            >
              <View className="flex-row items-center">
                <View className="bg-green-50 dark:bg-green-900/40 p-2.5 rounded-xl mr-4">
                  <Globe size={20} color="#10B981" />
                </View>
                <View className="min-w-0">
                  <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('language')}</LocalizedText>
                  <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs capitalize" numberOfLines={1} ellipsizeMode="tail">{settings.appLanguage === 'en' ? 'English' : 'اردو'}</LocalizedText>
                </View>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          {/* 7. VOICE SETTINGS */}
          <TouchableOpacity onPress={() => setVoiceModalVisible(true)} className="bg-surface dark:bg-dark-surface p-5 mb-6 rounded-2xl flex-row items-center justify-between border border-border dark:border-dark-border">

            <View className="flex-row items-center">
              <View className="bg-blue-50 dark:bg-blue-900/40 p-2.5 rounded-xl mr-4">
                <Volume2 size={20} color="#0EA5E9" />
              </View>
              <View className='flex-col flex-1'>
                <View className="flex-row items-center justify-between">
                  <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('voice')}</LocalizedText>
                  <View className='flex-row items-center flex-1 justify-end'>
                    <LocalizedText className="text-xs font-bold text-primary mr-2">
                      {settings.voiceEnabled ? (settings.englishEnabled ? "Dual" : "Urdu Only") : "Off"}
                    </LocalizedText>
                  </View>
                </View>

                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs" numberOfLines={1} ellipsizeMode="tail">{t('configure_language_behavior')}</LocalizedText>
              </View>

              <ChevronRight size={20} color="#CBD5E1" />
            </View>

          </TouchableOpacity>

          {/* 4. TEXT SIZE SCALING */}
          <View className="bg-surface dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm border border-border dark:border-dark-border mb-6">
            <View className="p-5 border-b border-border dark:border-dark-border">
              <View className="flex-row items-center mb-4">
                <View className="bg-orange-50 dark:bg-orange-900/40 p-2.5 rounded-xl mr-4">
                  <Maximize2 size={20} color="#F59E0B" />
                </View>
                <View className="min-w-0">
                  <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('text_size')}</LocalizedText>
                  <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs" numberOfLines={1} ellipsizeMode="tail">{t('adjust_text_for_readability')}</LocalizedText>
                </View>
              </View>

              {/* Text size preview and selector */}
              <View className="flex-row justify-between mb-4">
                {[1, 1.25, 1.5, 1.75].map((scale) => (
                  <TouchableOpacity
                    key={scale}
                    onPress={() => updateSettings({ textScale: scale as 1 | 1.25 | 1.5 | 1.75 })}
                    className={`flex-1 mx-1.5 py-3 rounded-xl border-2 items-center justify-center ${textScale === scale
                      ? 'bg-primary border-primary'
                      : 'bg-surface-highlight dark:bg-dark-surface-highlight border-border dark:border-dark-border'
                      }`}
                  >
                    <LocalizedText
                      style={{ fontSize: 12 * scale }}
                      className={textScale === scale ? 'text-white font-bold' : 'text-text-main dark:text-dark-text-main font-semibold'}
                    >
                      A
                    </LocalizedText>
                    <LocalizedText
                      className={`text-xs mt-1 ${textScale === scale ? 'text-white font-semibold' : 'text-text-muted dark:text-dark-text-muted'
                        }`}
                    >
                      {Math.round(scale * 100)}%
                    </LocalizedText>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Preview text */}
              <View className="bg-surface-highlight dark:bg-dark-surface-highlight p-4 rounded-xl">
                <LocalizedText
                  className='text-text-main dark:text-dark-text-main'
                  style={{ fontSize: getScaledSize('text-base') }}
                >
                  {t('text_size_preview')}
                </LocalizedText>
              </View>
            </View>
          </View>

          {/* 5. HIGH CONTRAST MODE */}
          {/* TODO: Re-implement high contrast mode */}
          {/* <View className="bg-surface dark:bg-dark-surface p-5 rounded-2xl flex-row items-center justify-between border border-border dark:border-dark-border shadow-sm mb-6">
            <View className="flex-row items-center flex-1 min-w-0 overflow-hidden">
              <View className="bg-indigo-50 dark:bg-indigo-900/40 p-2.5 rounded-xl mr-4">
                <Eye size={20} color="#6366F1" />
              </View>
              <View className="min-w-0">
                <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('high_contrast')}</LocalizedText>
                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs" numberOfLines={1} ellipsizeMode="tail">{t('bold_colors_for_visibility')}</LocalizedText>
              </View>
            </View>
            <View className="shrink-0 ml-2.5">
              <Switch
                value={settings.highContrast}
                onValueChange={(value) => updateSettings({ highContrast: value })}
                trackColor={{ false: '#CBD5E1', true: '#0EA5E9' }}
                thumbColor={settings.highContrast ? '#38BDF8' : '#64748B'}
              />
            </View>
          </View> */}

          {/* 6. SIMPLIFIED MODE */}
          {/* TODO: Re-implement simplified mode */}
          {/*
          <View className="bg-surface dark:bg-dark-surface p-5 rounded-2xl flex-row items-center justify-between border border-border dark:border-dark-border shadow-sm mb-6">
            <View className="flex-row items-center flex-1 min-w-0 overflow-hidden">
              <View className="bg-pink-50 dark:bg-pink-900/40 p-2.5 rounded-xl mr-4">
                <Minimize2 size={20} color="#EC4899" />
              </View>
              <View className="min-w-0">
                <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('simplified_mode')}</LocalizedText>
                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs" ellipsizeMode="tail">{t('show_essential_buttons_only')}</LocalizedText>
              </View>
            </View>
            <View className="shrink-0 ml-2.5">
              <Switch
                value={settings.simplifiedMode}
                onValueChange={(value) => updateSettings({ simplifiedMode: value })}
                trackColor={{ false: '#CBD5E1', true: '#0EA5E9' }}
                thumbColor={settings.simplifiedMode ? '#38BDF8' : '#64748B'}
              />
            </View>
          </View>
*/}
          {/* 7.5 REPLAY TUTORIAL */}
          <TouchableOpacity onPress={handleReplayTutorial} className="bg-surface dark:bg-dark-surface p-5 mb-6 rounded-2xl flex-row items-center justify-between border border-border dark:border-dark-border">
            <View className="flex-row items-center">
              <View className="bg-purple-50 dark:bg-purple-900/40 p-2.5 rounded-xl mr-4">
                <BookOpen size={20} color="#9333EA" />
              </View>
              <View className="min-w-0">
                <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('replay_tutorial')}</LocalizedText>
                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs" numberOfLines={1} ellipsizeMode="tail">{t('learn_how_to_use_the_app')}</LocalizedText>
              </View>
            </View>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>

          {/* 8. DANGER ZONE */}
          <TouchableOpacity onPress={handleReset} className="bg-surface dark:bg-dark-surface p-5 mb-24 rounded-2xl flex-row items-center justify-between border border-border dark:border-dark-border shadow-sm">
            <View className="flex-row flex-1 items-center overflow-hidden">
              <View className="bg-red-50 dark:bg-red-900/40 p-2.5 rounded-xl mr-4 border border-red-100 dark:border-red-700/60">
                <Trash2 size={20} color="#F43F5E" />
              </View>
              <View className="min-w-0">
                <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">{t('reset_data')}</LocalizedText>
                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs" numberOfLines={1} ellipsizeMode="tail">{t('deletes_all_medicines_settings')}</LocalizedText>
              </View>
            </View>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>

        </ScrollView>

        {/* MODALS */}
        <VoiceSettingsModal visible={isVoiceModalVisible} onClose={() => setVoiceModalVisible(false)} />
        <EditProfileModal visible={isProfileModalVisible} onClose={() => setProfileModalVisible(false)} />
        <LanguageSettingsModal visible={isLanguageModalVisible} onClose={() => setLanguageModalVisible(false)} />

      </AnimatedScreen>
    </View >
  );
}