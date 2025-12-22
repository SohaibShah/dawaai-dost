import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import Svg, { Rect, Defs, Mask, Circle } from 'react-native-svg';
import { useLocalization } from '@/utils/useLocalization';
import { VoiceService } from '@/services/VoiceService';
import { ChevronRight, X } from 'lucide-react-native';
import LocalizedText from '@/components/LocalizedText';
import { useStore } from '@/store/useStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface SpotlightTarget {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export interface TourStep {
  target: SpotlightTarget | null; // null means no spotlight, just show message
  title: string;
  description: string;
  titleUrdu: string;
  descriptionUrdu: string;
  placement?: 'top' | 'bottom' | 'center';
}

interface InteractiveTourProps {
  visible: boolean;
  steps: TourStep[];
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export default function InteractiveTour({
  visible,
  steps,
  currentStep,
  onNext,
  onSkip,
  onComplete,
}: InteractiveTourProps) {
  const { t } = useLocalization();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible && currentStep < steps.length) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Pulse animation for spotlight
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Speak the current step
      speakStep(steps[currentStep]);
    }
  }, [visible, currentStep]);

  const speakStep = (step: TourStep) => {
    const { settings } = useStore.getState();
    if (settings.voiceEnabled) {
      if (settings.englishEnabled) {
        VoiceService.speakDual(step.title + '. ' + step.description, step.titleUrdu + '. ' + step.descriptionUrdu);
      } else {
        VoiceService.speakDual('', step.titleUrdu + '. ' + step.descriptionUrdu);
      }
    }
  };

  if (!visible || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    fadeAnim.setValue(0);
    if (isLastStep) {
      VoiceService.stop();
      onComplete();
    } else {
      onNext();
    }
  };

  const handleSkip = () => {
    VoiceService.stop();
    onSkip();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1 }} pointerEvents="box-none">
        {/* Dark Overlay with Spotlight */}
        {step.target ? (
          <View style={{ flex: 1 }} pointerEvents="none">
            <SpotlightOverlay target={step.target} pulseAnim={pulseAnim} />
          </View>
        ) : (
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }} pointerEvents="none" />
        )}

        {/* Tooltip/Message Box */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            opacity: fadeAnim,
            ...(step.placement === 'top' && { top: 100 }),
            ...(step.placement === 'bottom' && { bottom: 100 }),
            ...(step.placement === 'center' && { 
              top: '50%', 
              transform: [{ translateY: -150 }] 
            }),
            ...(!step.placement && step.target && {
              top: step.target.y + step.target.height + 20 > SCREEN_HEIGHT / 2
                ? step.target.y - 200
                : step.target.y + step.target.height + 20,
            }),
            ...(!step.placement && !step.target && {
              top: '50%',
              transform: [{ translateY: -150 }],
            }),
          }}
          className="bg-surface dark:bg-dark-surface rounded-2xl p-6 shadow-2xl border border-border dark:border-dark-border"
          pointerEvents="auto"
        >
          {/* Close/Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            className="absolute top-4 right-4 z-10"
          >
            <X size={20} color="#94A3B8" />
          </TouchableOpacity>

          {/* Step Counter */}
          <View className="flex-row items-center mb-3">
            <View className="bg-primary/20 dark:bg-dark-primary/20 rounded-full px-3 py-1">
              <LocalizedText className="text-primary dark:text-dark-primary font-bold text-xs">
                {currentStep + 1} / {steps.length}
              </LocalizedText>
            </View>
          </View>

          {/* Title */}
          <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main mb-2">
            {step.title}
          </LocalizedText>

          {/* Urdu Title */}
          <LocalizedText className="text-lg font-semibold text-text-muted dark:text-dark-text-muted mb-3" style={{ textAlign: 'right' }}>
            {step.titleUrdu}
          </LocalizedText>

          {/* Description */}
          <LocalizedText className="text-base text-text-muted dark:text-dark-text-muted leading-6 mb-3">
            {step.description}
          </LocalizedText>

          {/* Urdu Description */}
          <LocalizedText className="text-sm text-text-muted dark:text-dark-text-muted leading-5 mb-6" style={{ textAlign: 'right' }}>
            {step.descriptionUrdu}
          </LocalizedText>

          {/* Navigation */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleSkip}>
              <LocalizedText className="text-text-muted dark:text-dark-text-muted font-semibold">
                {t('onboarding_skip')}
              </LocalizedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              className="bg-primary dark:bg-dark-primary rounded-full px-6 py-3 flex-row items-center"
            >
              <LocalizedText className="text-white font-bold mr-2">
                {isLastStep ? t('onboarding_finish') : t('onboarding_next')}
              </LocalizedText>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

interface SpotlightOverlayProps {
  target: SpotlightTarget;
  pulseAnim: Animated.Value;
}

function SpotlightOverlay({ target, pulseAnim }: SpotlightOverlayProps) {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  
  // Calculate center of target
  const centerX = target.x + target.width / 2;
  const centerY = target.y + target.height / 2;
  
  // Calculate radius to cover the target (with some padding)
  const radius = Math.max(target.width, target.height) / 2 + 20;

  return (
    <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH} style={{ position: 'absolute' }}>
      <Defs>
        <Mask id="mask">
          {/* White background (visible area) */}
          <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="white" />
          
          {/* Black circle (transparent area - the spotlight) */}
          <AnimatedCircle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="black"
          />
        </Mask>
      </Defs>
      
      {/* Dark overlay with mask applied */}
      <Rect
        x="0"
        y="0"
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        fill="rgba(0, 0, 0, 0.85)"
        mask="url(#mask)"
      />
      
      {/* Animated ring around spotlight */}
      <AnimatedCircle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke="#0EA5E9"
        strokeWidth="3"
        fill="none"
        opacity={0.6}
        scale={pulseAnim}
      />
    </Svg>
  );
}

// Helper hook to get element position
export function useElementPosition() {
  const [position, setPosition] = useState<SpotlightTarget | null>(null);
  const ref = useRef<any>(null);

  const measure = () => {
    if (ref.current) {
      ref.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setPosition({ x, y, width, height, borderRadius: 12 });
      });
    }
  };

  return { ref, position, measure };
}

// moved import to top
