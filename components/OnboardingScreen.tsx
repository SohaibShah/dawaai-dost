import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, ScrollView, Modal } from 'react-native';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useStore } from '@/store/useStore';
import { useLocalization } from '@/utils/useLocalization';
import LocalizedText from '@/components/LocalizedText';
import { VoiceService } from '@/services/VoiceService';
import { Globe, Volume2, VolumeX, Check, ChevronRight, ArrowRight } from 'lucide-react-native';
import InteractiveTour, { TourStep } from '@/components/InteractiveTour';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { currentStep, setCurrentStep, setCompleted, setShowOnboarding, targets } = useOnboardingStore();
  const { settings, updateSettings } = useStore();
  const { t } = useLocalization();
  
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>(settings.appLanguage);
  const [voiceEnabled, setVoiceEnabled] = useState(settings.voiceEnabled);
  const [dualLanguage, setDualLanguage] = useState(settings.englishEnabled);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate in when step changes
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Speak the current step
    speakCurrentStep();
  }, [currentStep]);

  const speakCurrentStep = () => {
    if (!voiceEnabled) return;
    const titleKeys = ['onboarding_welcome','onboarding_language_title','onboarding_voice_title','onboarding_features_title','onboarding_add_medicine_title','onboarding_mark_dose_title','onboarding_edit_medicine_title','onboarding_smart_suggestions_title','onboarding_profile_title','onboarding_ready_title'];
    const descKeys = [
      'onboarding_subtitle',
      'onboarding_language_description',
      'onboarding_voice_description',
      'onboarding_features_caption',
      'onboarding_add_medicine_description',
      'onboarding_mark_dose_description',
      'onboarding_edit_medicine_description',
      'onboarding_smart_suggestions_description',
      'onboarding_profile_description',
      'onboarding_ready_description',
    ];

    const title = t(titleKeys[currentStep] || '');
    const desc = t(descKeys[currentStep] || '');
    const en = `${title}. ${desc}`;
    const ur = `${title}۔ ${desc}`;
    if (dualLanguage) {
      VoiceService.speakDual(en, ur);
    } else {
      VoiceService.speakDual('', ur);
    }
  };

  const handleNext = () => {
    // Save settings after initial setup steps
    if (currentStep === 2) {
      updateSettings({
        appLanguage: selectedLanguage,
        voiceEnabled: voiceEnabled,
        englishEnabled: dualLanguage,
      });
    }

    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    VoiceService.stop();
    setCompleted(true);
    setShowOnboarding(false);
    onComplete();
  };

  const handleFinish = () => {
    VoiceService.stop();
    setCompleted(true);
    setShowOnboarding(false);
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return (
          <LanguageStep
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        );
      case 2:
        return (
          <VoiceStep
            voiceEnabled={voiceEnabled}
            dualLanguage={dualLanguage}
            onToggleVoice={setVoiceEnabled}
            onToggleDual={setDualLanguage}
          />
        );
      case 3:
        return <FeaturesIntroStep />;
      case 4:
        return <AddMedicineStep />;
      case 5:
        return <MarkDoseStep />;
      case 6:
        return <EditMedicineStep />;
      case 7:
        return <SmartSuggestionsStep />;
      case 8:
        return <ProfileStep />;
      case 9:
        return <ReadyStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // Interactive spotlight steps bound to measured targets
  const tourSteps: TourStep[] = useMemo(() => [
    { target: null, title: t('onboarding_welcome'), description: t('onboarding_subtitle'), titleUrdu: t('onboarding_welcome'), descriptionUrdu: t('onboarding_subtitle'), placement: 'center' },
    { target: null, title: t('onboarding_language_title'), description: t('onboarding_language_description'), titleUrdu: t('onboarding_language_title'), descriptionUrdu: t('onboarding_language_description'), placement: 'center' },
    { target: null, title: t('onboarding_voice_title'), description: t('onboarding_voice_description'), titleUrdu: t('onboarding_voice_title'), descriptionUrdu: t('onboarding_voice_description'), placement: 'center' },
    { target: null, title: t('onboarding_features_title'), description: t('onboarding_features_caption'), titleUrdu: t('onboarding_features_title'), descriptionUrdu: t('onboarding_features_caption'), placement: 'center' },
    { target: targets.addButton || null, title: t('onboarding_add_medicine_title'), description: t('onboarding_add_medicine_description'), titleUrdu: t('onboarding_add_medicine_title'), descriptionUrdu: t('onboarding_add_medicine_description') },
    { target: targets.dosePill || null, title: t('onboarding_mark_dose_title'), description: t('onboarding_mark_dose_description'), titleUrdu: t('onboarding_mark_dose_title'), descriptionUrdu: t('onboarding_mark_dose_description') },
    { target: targets.medicineCard || null, title: t('onboarding_edit_medicine_title'), description: t('onboarding_edit_medicine_description'), titleUrdu: t('onboarding_edit_medicine_title'), descriptionUrdu: t('onboarding_edit_medicine_description') },
    { target: targets.suggestionBanner || null, title: t('onboarding_smart_suggestions_title'), description: t('onboarding_smart_suggestions_description'), titleUrdu: t('onboarding_smart_suggestions_title'), descriptionUrdu: t('onboarding_smart_suggestions_description') },
    { target: null, title: t('onboarding_profile_title'), description: t('onboarding_profile_description'), titleUrdu: t('onboarding_profile_title'), descriptionUrdu: t('onboarding_profile_description'), placement: 'center' },
    { target: null, title: t('onboarding_ready_title'), description: t('onboarding_ready_description'), titleUrdu: t('onboarding_ready_title'), descriptionUrdu: t('onboarding_ready_description'), placement: 'center' },
  ], [targets, t]);

  const isSpotlightStep = currentStep >= 4 && currentStep <= 7;

  return (
    <Modal visible={true} animationType="fade" transparent={false}>
      <View className="flex-1 bg-background dark:bg-dark-background">
        {/* Skip Button */}
        <View className="absolute top-14 right-6 z-50">
          <TouchableOpacity
            onPress={handleSkip}
            className="px-4 py-2 rounded-full bg-surface dark:bg-dark-surface border border-border dark:border-dark-border"
          >
            <LocalizedText className="text-text-muted dark:text-dark-text-muted font-semibold">
              {t('onboarding_skip')}
            </LocalizedText>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View className="absolute top-14 left-6 z-50 flex-row space-x-1">
          {[...Array(10)].map((_, index) => (
            <View
              key={index}
              className={`h-1 w-6 rounded-full ${
                index <= currentStep
                  ? 'bg-primary dark:bg-dark-primary'
                  : 'bg-border dark:bg-dark-border'
              }`}
            />
          ))}
        </View>

        {/* Content */}
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center px-8 py-16">
              {renderStep()}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Navigation Buttons (hidden during spotlight to avoid overlay blocking) */}
        {!isSpotlightStep && (
          <View className="px-8 pb-10 pt-4 bg-surface dark:bg-dark-surface border-t border-border dark:border-dark-border">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handlePrev}
                className="flex-1 rounded-2xl py-4 flex-row items-center justify-center border border-border dark:border-dark-border"
              >
                <LocalizedText className="text-text-main dark:text-dark-text-main font-bold text-lg">
                  {t('onboarding_back')}
                </LocalizedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                className="flex-1 bg-primary dark:bg-dark-primary rounded-2xl py-4 flex-row items-center justify-center"
              >
                <LocalizedText className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg mr-2">
                  {currentStep === 9 ? t('onboarding_finish') : t('onboarding_next')}
                </LocalizedText>
                {currentStep === 9 ? (
                  <Check size={24} color="#FFFFFF" />
                ) : (
                  <ChevronRight size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Interactive Spotlight Overlay */}
        <InteractiveTour
          visible={isSpotlightStep}
          steps={tourSteps}
          currentStep={currentStep}
          onNext={handleNext}
          onSkip={handleSkip}
          onComplete={handleFinish}
        />
      </View>
    </Modal>
  );
}

// Welcome Step
function WelcomeStep() {
  const { t } = useLocalization();
  
  return (
    <View className="items-center">
      <View className="w-28 h-28 bg-primary/10 dark:bg-dark-primary/10 rounded-full items-center justify-center mb-6">
        <LocalizedText className="text-6xl">💊</LocalizedText>
      </View>
      <LocalizedText className="text-3xl font-bold text-text-main dark:text-dark-text-main text-center mb-3">
        {t('onboarding_welcome')}
      </LocalizedText>
      <LocalizedText className="text-base text-text-muted dark:text-dark-text-muted text-center">
        {t('onboarding_subtitle')}
      </LocalizedText>
    </View>
  );
}

// Language Selection Step
interface LanguageStepProps {
  selectedLanguage: 'en' | 'ur';
  onSelectLanguage: (lang: 'en' | 'ur') => void;
}

function LanguageStep({ selectedLanguage, onSelectLanguage }: LanguageStepProps) {
  const { t } = useLocalization();
  
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full items-center justify-center mb-3">
          <Globe size={32} color="#10B981" />
        </View>
        <LocalizedText className="text-2xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
          {t('onboarding_language_title')}
        </LocalizedText>
        <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted text-center">
          {t('onboarding_language_description')}
        </LocalizedText>
      </View>

      <View className="space-y-3">
        <TouchableOpacity
          onPress={() => onSelectLanguage('en')}
          className={`p-5 rounded-2xl border-2 flex-row items-center justify-between ${
            selectedLanguage === 'en'
              ? 'border-primary bg-primary/10 dark:border-dark-primary dark:bg-dark-primary/10'
              : 'border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
          }`}
        >
          <View>
            <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main">
              English
            </LocalizedText>
            <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted">
              {t('english')}
            </LocalizedText>
          </View>
          {selectedLanguage === 'en' && (
            <View className="w-8 h-8 bg-primary dark:bg-dark-primary rounded-full items-center justify-center">
              <Check size={18} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectLanguage('ur')}
          className={`p-5 rounded-2xl border-2 flex-row items-center justify-between ${
            selectedLanguage === 'ur'
              ? 'border-primary bg-primary/10 dark:border-dark-primary dark:bg-dark-primary/10'
              : 'border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
          }`}
        >
          <View>
            <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main">
              اردو
            </LocalizedText>
            <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted">
              {t('urdu')}
            </LocalizedText>
          </View>
          {selectedLanguage === 'ur' && (
            <View className="w-8 h-8 bg-primary dark:bg-dark-primary rounded-full items-center justify-center">
              <Check size={18} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Voice Assistant Step
interface VoiceStepProps {
  voiceEnabled: boolean;
  dualLanguage: boolean;
  onToggleVoice: (enabled: boolean) => void;
  onToggleDual: (enabled: boolean) => void;
}

function VoiceStep({ voiceEnabled, dualLanguage, onToggleVoice, onToggleDual }: VoiceStepProps) {
  const { t } = useLocalization();
  
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full items-center justify-center mb-3">
          {voiceEnabled ? (
            <Volume2 size={32} color="#0EA5E9" />
          ) : (
            <VolumeX size={32} color="#94A3B8" />
          )}
        </View>
        <LocalizedText className="text-2xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
          {t('onboarding_voice_title')}
        </LocalizedText>
        <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted text-center">
          {t('onboarding_voice_description')}
        </LocalizedText>
      </View>

      <View className="space-y-3">
        {/* Enable Voice Toggle */}
        <View className="p-5 rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border">
          <View className="flex-row items-center justify-between mb-2">
            <LocalizedText className="text-lg font-bold text-text-main dark:text-dark-text-main">
              {t('onboarding_voice_enable')}
            </LocalizedText>
            <TouchableOpacity
              onPress={() => onToggleVoice(!voiceEnabled)}
              className={`w-14 h-8 rounded-full justify-center ${
                voiceEnabled ? 'bg-primary' : 'bg-border dark:bg-dark-border'
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full bg-white ${
                  voiceEnabled ? 'self-end mr-1' : 'self-start ml-1'
                }`}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Voice Mode Selection */}
        {voiceEnabled && (
          <View className="space-y-3">
            <LocalizedText className="text-lg font-semibold text-text-main dark:text-dark-text-main mb-2">
              {t('onboarding_voice_mode_title')}
            </LocalizedText>

            <TouchableOpacity
              onPress={() => onToggleDual(true)}
              className={`p-5 rounded-2xl border-2 ${
                dualLanguage
                  ? 'border-primary bg-primary/10 dark:border-dark-primary dark:bg-dark-primary/10'
                  : 'border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <LocalizedText className="text-lg font-bold text-text-main dark:text-dark-text-main mb-1">
                    {t('onboarding_voice_dual')}
                  </LocalizedText>
                  <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted">
                    English + اردو
                  </LocalizedText>
                </View>
                {dualLanguage && (
                  <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                    <Check size={14} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onToggleDual(false)}
              className={`p-5 rounded-2xl border-2 ${
                !dualLanguage
                  ? 'border-primary bg-primary/10 dark:border-dark-primary dark:bg-dark-primary/10'
                  : 'border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <LocalizedText className="text-lg font-bold text-text-main dark:text-dark-text-main mb-1">
                    {t('onboarding_voice_urdu_only')}
                  </LocalizedText>
                  <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted">
                    صرف اردو
                  </LocalizedText>
                </View>
                {!dualLanguage && (
                  <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                    <Check size={14} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// Features Introduction Step
function FeaturesIntroStep() {
  const { t } = useLocalization();
  
  return (
    <View className="items-center">
      <View className="w-20 h-20 bg-purple-100 dark:bg-purple-900/40 rounded-full items-center justify-center mb-4">
        <LocalizedText className="text-5xl">✨</LocalizedText>
      </View>
      <LocalizedText className="text-2xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
        {t('onboarding_features_title')}
      </LocalizedText>
      <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted text-center">
        {t('onboarding_features_caption')}
      </LocalizedText>
    </View>
  );
}

// Add Medicine Step
function AddMedicineStep() {
  const { t } = useLocalization();
  
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-success-bg dark:bg-dark-success-bg rounded-full items-center justify-center mb-3">
          <LocalizedText className="text-4xl">➕</LocalizedText>
        </View>
        <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
          {t('onboarding_add_medicine_title')}
        </LocalizedText>
      </View>

      <View className="bg-surface dark:bg-dark-surface rounded-2xl p-5 border border-border dark:border-dark-border">
        <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted leading-6">
          {t('onboarding_add_medicine_description')}
        </LocalizedText>
      </View>
    </View>
  );
}

// Mark Dose Step
function MarkDoseStep() {
  const { t } = useLocalization();
  
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-warning-bg dark:bg-dark-warning-bg rounded-full items-center justify-center mb-3">
          <LocalizedText className="text-4xl">✅</LocalizedText>
        </View>
        <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
          {t('onboarding_mark_dose_title')}
        </LocalizedText>
      </View>

      <View className="bg-surface dark:bg-dark-surface rounded-2xl p-5 border border-border dark:border-dark-border">
        <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted leading-6 mb-4">
          {t('onboarding_mark_dose_description')}
        </LocalizedText>
        <LocalizedText className="text-xs text-text-muted dark:text-dark-text-muted mb-3">
          {t('onboarding_tap_here')} 👇
        </LocalizedText>
      </View>
    </View>
  );
}

// Edit Medicine Step
function EditMedicineStep() {
  const { t } = useLocalization();
  
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-error-bg dark:bg-dark-error-bg rounded-full items-center justify-center mb-3">
          <LocalizedText className="text-4xl">✏️</LocalizedText>
        </View>
        <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
          {t('onboarding_edit_medicine_title')}
        </LocalizedText>
      </View>

      <View className="bg-surface dark:bg-dark-surface rounded-2xl p-5 border border-border dark:border-dark-border">
        <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted leading-6">
          {t('onboarding_edit_medicine_description')}
        </LocalizedText>
      </View>
    </View>
  );
}

// Smart Suggestions Step
function SmartSuggestionsStep() {
  const { t } = useLocalization();
  
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-secondary/10 dark:bg-dark-secondary/10 rounded-full items-center justify-center mb-3">
          <LocalizedText className="text-4xl">🎯</LocalizedText>
        </View>
        <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
          {t('onboarding_smart_suggestions_title')}
        </LocalizedText>
      </View>

      <View className="bg-surface dark:bg-dark-surface rounded-2xl p-5 border border-border dark:border-dark-border">
        <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted leading-6 mb-4">
          {t('onboarding_smart_suggestions_description')}
        </LocalizedText>
      </View>
    </View>
  );
}

// Profile Step
function ProfileStep() {
  const { t } = useLocalization();
  
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/10 rounded-full items-center justify-center mb-3">
          <LocalizedText className="text-4xl">👤</LocalizedText>
        </View>
        <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main text-center mb-2">
          {t('onboarding_profile_title')}
        </LocalizedText>
      </View>

      <View className="bg-surface dark:bg-dark-surface rounded-2xl p-5 border border-border dark:border-dark-border">
        <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted leading-6">
          {t('onboarding_profile_description')}
        </LocalizedText>
      </View>
    </View>
  );
}

// Ready Step
function ReadyStep() {
  const { t } = useLocalization();
  
  return (
    <View className="items-center">
      <View className="w-24 h-24 bg-success-bg dark:bg-dark-success-bg rounded-full items-center justify-center mb-6">
        <LocalizedText className="text-6xl">🎉</LocalizedText>
      </View>
      <LocalizedText className="text-2xl font-bold text-text-main dark:text-dark-text-main text-center mb-3">
        {t('onboarding_ready_title')}
      </LocalizedText>
      <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted text-center">
        {t('onboarding_ready_description')}
      </LocalizedText>
    </View>
  );
}
