import React, { useState, useRef, useEffect } from 'react';
import {
  View, ScrollView,
  ActivityIndicator, Pressable, StyleSheet, Dimensions,
  Platform, TouchableOpacity, Image,
  TextInput
} from 'react-native';
import LocalizedText from '@/components/LocalizedText';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { ArrowLeft, Zap, Volume2, Clock, CheckCircle, Camera, ScanLine } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { useStore } from '@/store/useStore';
import { useAlertStore } from '@/store/alertStore';
import { useLocalization } from '@/utils/useLocalization';
import { useColorScheme } from 'nativewind';
import * as Speech from 'expo-speech';
import DateTimePicker from '@react-native-community/datetimepicker';

import { MedicineMatcher } from '@/services/MedicineMatcher';
import { OcrService } from '@/services/OcrService';

import { VoiceService } from '@/services/VoiceService';

// --- Types & Constants ---
type WizardStep = 'camera' | 'name' | 'frequency' | 'times' | 'stock' | 'review';
const STEPS = ['name', 'frequency', 'times', 'stock', 'review'];
const { width } = Dimensions.get('window');

export default function AddMedicineScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const addMedicine = useStore((state) => state.addMedicine);
  const { showAlert } = useAlertStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t, getDualTTS, getMedicineName } = useLocalization();

  // --- State: Camera ---
  const [autoFocusState, setAutoFocusState] = useState<'on' | 'off'>('on');
  const [focusPoint, setFocusPoint] = useState({ x: 0, y: 0, visible: false });
  const [imageUri, setImageUri] = useState<string | null>(null);

  // --- State: Wizard Data ---
  const [currentStep, setCurrentStep] = useState<WizardStep>('camera');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [timeSlots, setTimeSlots] = useState<Date[]>([new Date()]);
  const [stock, setStock] = useState('');
  const [stockType, setStockType] = useState('Pills');
  const [showPickerIndex, setShowPickerIndex] = useState<number | null>(null);

  // --- Effects ---
  useEffect(() => {
    if (currentStep === 'name' && !name) {
      const { en, hi } = getDualTTS('prompt_enter_name');
      VoiceService.speakDual(en, hi);
    }
    if (currentStep === 'frequency') {
      const { en, hi } = getDualTTS('prompt_how_often');
      VoiceService.speakDual(en, hi);
    }
    if (currentStep === 'times') {
      const { en, hi } = getDualTTS('prompt_set_time');
      VoiceService.speakDual(en, hi);
    }
    if (currentStep === 'stock') {
      const { en, hi } = getDualTTS('prompt_stock_amount');
      VoiceService.speakDual(en, hi);
    }
  }, [currentStep, getDualTTS]);

  // --- Handlers ---

  const handleTapToFocus = (e: any) => {
    const { pageX, pageY } = e.nativeEvent;
    setFocusPoint({ x: pageX, y: pageY, visible: true });
    setAutoFocusState('off');
    setTimeout(() => setAutoFocusState('on'), 50);
    setTimeout(() => setFocusPoint(p => ({ ...p, visible: false })), 1000);
  };

  const processImage = async (base64: string) => {
    try {
      const rawText = await OcrService.recognizeText(base64);
      console.log("Raw OCR:", rawText);

      const result = MedicineMatcher.processText(rawText);

      console.log("Matched Result:", result);

      setIsProcessing(false);

      if (result.confidence) {
        setName(result.name);
        setDosage(result.dosage);
        setCurrentStep('name');
        const { en, hi } = getDualTTS('prompt_detected_medicine');
        VoiceService.speakDual(`Detected medicine: ${result.name}, Dosage: ${result.dosage}`, `${hi} ${result.name}, ${result.dosage}`);
      } else {
        showAlert({
          title: t('no_match_found'),
          message: t('could_not_identify'),
          type: "error",
          onConfirm: () => setCurrentStep('name'),
          confirmText: t('continue')
        });
        const { en, hi } = getDualTTS('could_not_identify');
        VoiceService.speakDual(en, hi);
      }
    } catch (error) {
      console.error("Processing Error:", error);
      showAlert({
        title: t('network_error'),
        message: t('internet_required'),
        type: "error",
        onConfirm: () => {
          setIsProcessing(false);
          setCurrentStep('name');
        },
        confirmText: t('ok')
      });
      const { en, hi } = getDualTTS('internet_required');
      VoiceService.speakDual(en, hi);
    }
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });

        setImageUri(photo?.uri || null);
        setIsProcessing(true);

        // OCR Processing
        if (photo?.base64) {
          processImage(photo.base64);
        }

      } catch (error) {
        console.error("Camera Error:", error);
        showAlert({
          title: t('error_title'),
          message: t('failed_take_picture'),
          type: "error",
          onConfirm: () => setIsProcessing(false),
          confirmText: t('ok')
        });
        const { en, hi } = getDualTTS('failed_take_picture');
        VoiceService.speakDual(en, hi);
        return;
      }
    };
  }

  const handleNext = () => {
    const idx = STEPS.indexOf(currentStep);
    if (!validateStep()) return;
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1] as WizardStep);
    } else {
      // Final Save
      handleSave();
    }
  };

  const handleBack = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1] as WizardStep);
    } else {
      setCurrentStep('camera');
      setImageUri(null);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date, index: number = 0) => {
    if (Platform.OS === 'android') setShowPickerIndex(null); // Close picker on Android

    if (selectedDate) {
      const newSlots = [...timeSlots];
      newSlots[index] = selectedDate;

      // SMART FEATURE: Auto-calculate subsequent slots if "3 times a day"
      if (index === 0 && timesPerDay > 1) {
        const interval = 24 / (timesPerDay || 1); // Simple spacing logic
        for (let i = 1; i < timesPerDay; i++) {
          const nextTime = new Date(selectedDate);
          nextTime.setHours(selectedDate.getHours() + i * interval);
          newSlots[i] = nextTime;
        }
      }
      setTimeSlots(newSlots);
    }
  };

  const updateFrequency = (type: string) => {
    setFrequency(type);
    if (type === 'Daily') {
      setTimesPerDay(1);
      setTimeSlots([new Date()]);
      const { en, hi } = getDualTTS('daily');
      VoiceService.speakDual(en, hi);
    } else if (type === '2x Daily') {
      setTimesPerDay(2);
      const baseTime = new Date();
      const slot2 = new Date(baseTime);
      slot2.setHours(baseTime.getHours() + 12);
      setTimeSlots([baseTime, slot2]);
      const { en, hi } = getDualTTS('2x_daily');
      VoiceService.speakDual(en, hi);
    } else if (type === '3x Daily') {
      setTimesPerDay(3);
      const baseTime = new Date();
      const slot2 = new Date(baseTime);
      slot2.setHours(baseTime.getHours() + 8);
      const slot3 = new Date(baseTime);
      slot3.setHours(baseTime.getHours() + 16);
      setTimeSlots([baseTime, slot2, slot3]);
      const { en, hi } = getDualTTS('3x_daily');
      VoiceService.speakDual(en, hi);
    } else if (type == '4x Daily') {
      setTimesPerDay(4);
      const baseTime = new Date();
      const slot2 = new Date(baseTime);
      slot2.setHours(baseTime.getHours() + 6);
      const slot3 = new Date(baseTime);
      slot3.setHours(baseTime.getHours() + 12);
      const slot4 = new Date(baseTime);
      slot4.setHours(baseTime.getHours() + 18);
      setTimeSlots([baseTime, slot2, slot3, slot4]);
      const { en, hi } = getDualTTS('4x_daily');
      VoiceService.speakDual(en, hi);
    } else if (type === 'Weekly' || type === 'As Needed') {
      setTimesPerDay(1);
      setTimeSlots([new Date()]);
      const key = type === 'Weekly' ? 'weekly' : 'as_needed';
      const { en, hi } = getDualTTS(key);
      VoiceService.speakDual(en, hi);
    }
  };

  const handleSave = () => {
    addMedicine({
      id: Date.now().toString(),
      name,
      dosage,
      frequency,
      timeSlots: timeSlots.map(d => VoiceService.formatTime({ time: d })),
      imageUri: imageUri || undefined,
      stock: parseInt(stock) || 0,
      color: 'bg-blue-500' // Default color
    });
    
    // Reset tab and navigate
    resetTab();
    router.push('/(tabs)');
    
    // Show success alert after navigation
    setTimeout(() => {
      showAlert({
        title: t('alert_success'),
        message: t('medicine_added').replace('{name}', getMedicineName(name)),
        type: "success",
        confirmText: t('done'),
        secondaryConfirmText: t('done'),
        onConfirm: () => {}
      });
    }, 300);
    
    const { en, hi } = getDualTTS('medicine_added');
    VoiceService.speakDual(en, hi);
  };

  const validateStep = () => {
    if (currentStep === 'name') {
      if (!name.trim()) {
        showAlert({
          title: t('validation_error_title'),
          message: t('enter_medicine_name'),
          type: "error",
          confirmText: t('ok')
        });
        const { en, hi } = getDualTTS('enter_medicine_name');
        VoiceService.speakDual(en, hi);
        return false;
      } else if (!dosage.trim()) {
        showAlert({
          title: t('validation_error_title'),
          message: t('enter_dosage'),
          type: "error",
          confirmText: t('ok')
        });
        const { en, hi } = getDualTTS('enter_dosage');
        VoiceService.speakDual(en, hi);
        return false;
      }
    }

    if (currentStep === 'stock') {
      if (!stock.trim() || isNaN(Number(stock)) || Number(stock) <= 0) {
        const stockTypeLocalized = t(stockType.toLowerCase() as any);
        showAlert({
          title: t('validation_error_title'),
          message: t('enter_valid_stock').replace('{type}', stockTypeLocalized),
          type: "error",
          confirmText: t('ok')
        });
        const { en, hi } = getDualTTS('enter_valid_stock');
        VoiceService.speakDual(en, hi);
        return false;
      }
    }
    return true;
  }

  const resetTab = () => {
    setCurrentStep('camera');
    setName('');
    setDosage('');
    setFrequency('Daily');
    setTimesPerDay(1);
    setTimeSlots([new Date()]);
    setStock('');
    setStockType('Pills');
    setImageUri(null);
  };

  // --- RENDER HELPERS ---

  // Progress Bar Component
  const renderProgressBar = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    const progress = ((currentIndex + 1) / STEPS.length) * 100;

    return (
      <View className="h-2 bg-surface-highlight dark:bg-dark-surface-highlight rounded-full mb-6 overflow-hidden border border-border/60 dark:border-dark-border/60">
        <MotiView
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'timing', duration: 500 }}
        />
      </View>
    );
  };

  // --- RENDER: CAMERA ---
  if (!permission?.granted || currentStep === 'camera') {
    if (!permission?.granted) return <RequestPermissionView request={requestPermission} />;

    if (!isFocused) {
      return <View className="flex-1 bg-black" />;
    }

    return (
      <View className="flex-1 bg-black">
        <CameraView style={{ flex: 1 }} ref={cameraRef} autofocus={autoFocusState}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleTapToFocus}>
            {focusPoint.visible && <FocusBox x={focusPoint.x} y={focusPoint.y} />}
            <View className="flex-1 justify-between p-6 pb-24 pt-12">
              <View className="bg-black/40 mt-8 p-4 rounded-xl self-center">
                <LocalizedText className="text-white font-bold">{t('scan_medicine')}</LocalizedText>
              </View>
              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  onPress={takePicture}
                  className="bg-surface dark:bg-dark-surface w-20 h-20 rounded-full border-4 border-border dark:border-dark-border items-center justify-center"
                >
                  <ScanLine size={32} color={'#0EA5E9'} className="text-slate-500" />
                </TouchableOpacity>
              </View>
            </View>
            {isProcessing && (
              <View className="absolute inset-0 bg-black/50 items-center justify-center">
                <ActivityIndicator size="large" color="#0EA5E9" />
                <LocalizedText className="text-white mt-4 font-bold">{t('reading_text')}</LocalizedText>
              </View>
            )}
          </Pressable>
        </CameraView>
      </View>
    );
  }

  // --- RENDER: FORM WIZARD ---
  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* Header Image */}
      <View className="absolute top-0 w-full h-64 bg-slate-900 dark:bg-dark-surface">
        {imageUri && <Image source={{ uri: imageUri }} className="w-full h-full opacity-50" />}
      </View>

      <TouchableOpacity onPress={handleBack} className="absolute top-12 left-5 z-50 bg-black/30 p-2 rounded-full border border-border/50">
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>

      {/* Main Card */}
      <View className="flex-1 mt-40 bg-surface dark:bg-dark-surface rounded-t-[40px] shadow-2xl px-8 pt-8 border border-border dark:border-dark-border">
        {renderProgressBar()}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <AnimatePresence exitBeforeEnter>

            {/* STEP 1: NAME & DOSAGE */}
            {currentStep === 'name' && (
              <MotiView key="step1" from={{ opacity: 0, left: 20 }} animate={{ opacity: 1, left: 0 }} exit={{ opacity: 0, left: -20 }}>
                <LocalizedText sizeClass="text-2xl" className="font-bold text-text-main dark:text-dark-text-main mb-6" numberOfLines={1} ellipsizeMode="tail" marquee>
                  {t('what_is_it_called')}
                </LocalizedText>

                <InputGroup
                  label={t('prompt_medicine_name')}
                  // subLabel={t('medicine_name_sublabel')}
                  value={name}
                  placeholder={t('medicine_name_placeholder')}
                  onChange={setName}
                  icon={<Zap size={20} color="#94A3B8" />}
                  onSpeak={() => {
                    const { en, hi } = getDualTTS('prompt_enter_name');
                    VoiceService.speakDual(en, hi);
                  }}
                />

                <InputGroup
                  label={t('dosage_label')}
                  subLabel={t('dosage_sublabel')}
                  value={dosage}
                  onChange={setDosage}
                  placeholder={t('dosage_placeholder')}
                  icon={<Zap size={20} color="#94A3B8" />}
                  onSpeak={() => {
                    const { en, hi } = getDualTTS('dosage_label');
                    VoiceService.speakDual(en, hi);
                  }}
                />
              </MotiView>
            )}

            {/* STEP 2: FREQUENCY */}
            {currentStep === 'frequency' && (
              <MotiView key="step2" from={{ opacity: 0, left: 20 }} animate={{ opacity: 1, left: 0 }} exit={{ opacity: 0, left: -20 }}>
                <LocalizedText sizeClass="text-2xl" className="font-bold text-text-main dark:text-dark-text-main mb-6" numberOfLines={1} ellipsizeMode="tail" marquee>
                  {t('how_often')}
                </LocalizedText>

                <View className="flex-row flex-wrap gap-3">
                  {['Daily', '2x Daily', '3x Daily', '4x Daily', 'Weekly', 'As Needed'].map((opt) => {
                    const freqKey = opt === 'Daily' ? 'daily' : opt === '2x Daily' ? '2x_daily' : opt === '3x Daily' ? '3x_daily' : opt === '4x Daily' ? '4x_daily' : opt === 'Weekly' ? 'weekly' : 'as_needed';
                    return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => updateFrequency(opt)}
                      className={`w-[48%] py-4 rounded-2xl border-2 items-center justify-center ${frequency === opt ? 'bg-primary/10 border-primary' : 'bg-background dark:bg-dark-background border-border dark:border-dark-border'
                        }`}
                    >
                      <LocalizedText sizeClass="text-lg" className={`${frequency === opt ? 'text-primary' : 'text-text-muted dark:text-dark-text-muted'} font-bold`} numberOfLines={1} ellipsizeMode="tail">
                        {t(freqKey)}
                      </LocalizedText>
                      {frequency === opt && <CheckCircle size={20} color="#0EA5E9" style={{ position: 'absolute', top: 10, right: 10 }} />}
                    </TouchableOpacity>
                  )})}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const { en, hi } = getDualTTS('prompt_select_frequency');
                    VoiceService.speakDual(en, hi);
                  }}
                  className="mt-4 self-center bg-surface-highlight dark:bg-dark-surface-highlight p-2 rounded-full border border-border/60 dark:border-dark-border/60">
                  <Volume2 size={24} color="#0EA5E9" />
                </TouchableOpacity>
              </MotiView>
            )}

            {/* STEP 3: TIMES */}
            {currentStep === 'times' && (
              <MotiView key="step3" from={{ opacity: 0, left: 20 }} animate={{ opacity: 1, left: 0 }} exit={{ opacity: 0, left: -20 }}>
                <LocalizedText sizeClass="text-2xl" className="font-bold text-text-main dark:text-dark-text-main mb-2" numberOfLines={1} ellipsizeMode="tail" marquee>
                  {t('set_timings')}
                </LocalizedText>
                <LocalizedText sizeClass="text-sm" className="text-text-muted dark:text-dark-text-muted mb-6" numberOfLines={1} ellipsizeMode="tail">
                  {t('calculated_for_you')}
                </LocalizedText>

                {timeSlots.map((time, index) => (
                  <View key={index} className="mb-4">
                    <LocalizedText sizeClass="text-sm" className="font-bold text-text-muted dark:text-dark-text-muted mb-2" numberOfLines={1} ellipsizeMode="tail">
                      {t('dose')} {index + 1}
                    </LocalizedText>
                    <View className="flex-row items-center bg-background dark:bg-dark-background p-4 rounded-xl border border-border dark:border-dark-border">
                      <Clock size={24} color="#0EA5E9" className="mr-4" />
                      {Platform.OS === 'android' && (
                        <TouchableOpacity
                          onPress={() => setShowPickerIndex(index)}
                          className="flex-1 bg-background dark:bg-dark-background p-3 rounded-xl"
                        >
                          <LocalizedText sizeClass="text-lg" className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail">
                            {VoiceService.formatTime({ time })}
                          </LocalizedText>
                        </TouchableOpacity>
                      )}
                      {(Platform.OS === 'ios' || showPickerIndex === index) && (
                        <DateTimePicker
                          value={time}
                          mode="time"
                          themeVariant={isDark ? 'dark' : 'light'}
                          display={Platform.OS === 'ios' ? 'compact' : 'default'}
                          onChange={(e, date) => handleTimeChange(e, date, index)}
                          style={{ width: 100 }} // Adjust for Android/iOS differences
                        />
                      )}
                      <TouchableOpacity
                        onPress={() => { VoiceService.speakDual(`Dose at ${VoiceService.formatTime({ time })}.`, `दवाई का वक़्त ${VoiceService.getUrduTimePhrase({ time })}`); }}
                        className='ml-4 self-center bg-surface-highlight dark:bg-dark-surface-highlight p-2 rounded-full border border-border/60 dark:border-dark-border/60'
                      >
                        <Volume2 size={24} color="#0EA5E9" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </MotiView>
            )}

            {/* STEP 4: STOCK */}
            {currentStep === 'stock' && (
              <MotiView key="step4" from={{ opacity: 0, left: 20 }} animate={{ opacity: 1, left: 0 }} exit={{ opacity: 0, left: -20 }}>
                <LocalizedText sizeClass="text-2xl" className="font-bold text-text-main dark:text-dark-text-main mb-6" numberOfLines={1} ellipsizeMode="tail" marquee>
                  {t('current_stock_label')}
                </LocalizedText>

                <View className="flex-row mb-6 bg-surface-highlight dark:bg-dark-surface-highlight p-1 rounded-xl border border-border dark:border-dark-border">
                  {['Pills', 'Strips', 'Bottles'].map(stockTypeOption => {
                    const isActive = stockType === stockTypeOption;
                    const stockKey = stockTypeOption.toLowerCase() as 'pills' | 'strips' | 'bottles';
                    return (
                      <TouchableOpacity
                        key={stockTypeOption}
                        onPress={() => setStockType(stockTypeOption)}
                        className={`flex-1 py-2 items-center rounded-lg ${isActive ? 'bg-background dark:bg-dark-background' : ''}`}
                      >
                        <LocalizedText sizeClass="text-sm" className={isActive ? 'font-bold text-primary dark:text-dark-primary' : 'text-text-muted dark:text-dark-text-muted'} numberOfLines={1} ellipsizeMode="tail">
                          {t(stockKey)}
                        </LocalizedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <InputGroup
                  label={`${t('current_stock_label')} (${t(stockType.toLowerCase() as any)})`}
                  subLabel={t('stock_quantity_placeholder')}
                  value={stock}
                  onChange={setStock}
                  keyboardType="numeric"
                  placeholder={t('stock_quantity_placeholder')}
                  onSpeak={() => {
                    const { en, hi } = getDualTTS('prompt_stock_amount');
                    VoiceService.speakDual(en, hi);
                  }}
                />
              </MotiView>
            )}

            {/* STEP 5: REVIEW */}
            {currentStep === 'review' && (
              <MotiView key="step5" from={{ opacity: 0, left: 20 }} animate={{ opacity: 1, left: 0 }}>
                <LocalizedText sizeClass="text-2xl" className="font-bold text-text-main dark:text-dark-text-main mb-6" numberOfLines={1} ellipsizeMode="tail" marquee>
                  {t('review_details')}
                </LocalizedText>
                <View className="bg-surface-highlight dark:bg-dark-surface-highlight p-6 rounded-3xl space-y-4 border border-border dark:border-dark-border">
                  <ReviewRow label={t('medicine_name')} value={name} />
                  <ReviewRow label={t('dosage_label')} value={dosage} />
                  <ReviewRow label={t('frequency')} value={frequency} />
                  <ReviewRow label={t('current_stock_label')} value={`${stock} ${t(stockType.toLowerCase() as any)}`} />
                </View>
              </MotiView>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <View className="flex-row mt-10 gap-4">
            {currentStep !== 'review' ? (
              <TouchableOpacity onPress={handleNext} className="flex-1 bg-primary py-4 rounded-2xl items-center shadow-lg shadow-blue-500/30">
                <LocalizedText sizeClass="text-lg" className="text-white font-bold" numberOfLines={1} ellipsizeMode="tail">{t('next_step')}</LocalizedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSave} className="flex-1 bg-success py-4 rounded-2xl items-center shadow-lg shadow-green-500/30">
                <LocalizedText sizeClass="text-lg" className="text-white font-bold" numberOfLines={1} ellipsizeMode="tail">{t('add_to_medicines')}</LocalizedText>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

// --- SUB COMPONENTS ---

const FocusBox = ({ x, y }: { x: number, y: number }) => (
  <View style={{ position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderColor: '#FACC15', borderWidth: 2, borderRadius: 8, zIndex: 99 }} />
);

const RequestPermissionView = ({ request }: any) => {
  const { t } = useLocalization();
  return (
  <View className="flex-1 flex flex-col gap-5 items-center justify-center m-5">
    <Camera size={80} color="#0EA5E9" />
    <LocalizedText sizeClass="text-lg" className="text-center text-text-main dark:text-dark-text-main font-semibold mb-4" numberOfLines={1} ellipsizeMode="tail">
      {t('camera_permission_needed')}
    </LocalizedText>
    <TouchableOpacity className='p-5 bg-surface-highlight dark:bg-dark-surface-highlight rounded-full border border-border dark:border-dark-border' onPress={request}>
      <LocalizedText sizeClass='text-sm' className='text-primary font-semibold' numberOfLines={1} ellipsizeMode='tail'>
        {t('enable_camera')}
      </LocalizedText>
    </TouchableOpacity>
  </View>
);
};

const InputGroup = ({ label, subLabel, value, onChange, placeholder, keyboardType, onSpeak }: any) => (
  <View className="mb-5">
    <View className="flex-row justify-between items-center mb-2">
      <View>
        <LocalizedText sizeClass="text-lg" className="text-text-muted dark:text-dark-text-muted font-bold uppercase" numberOfLines={1} ellipsizeMode="tail">{label}</LocalizedText>
        {subLabel && <LocalizedText sizeClass="text-xs" className="text-primary italic" numberOfLines={1} ellipsizeMode="tail">{subLabel}</LocalizedText>}
      </View>
      <TouchableOpacity onPress={onSpeak}>
        <Volume2 size={18} color="#0EA5E9" />
      </TouchableOpacity>
    </View>
    <TextInput
      value={value} onChangeText={onChange} placeholder={placeholder} keyboardType={keyboardType}
      className="bg-background dark:bg-dark-background p-5 rounded-2xl text-text-main dark:text-dark-text-main text-lg font-semibold border border-border dark:border-dark-border"
      placeholderTextColor="#94A3B8"
    />
  </View>
);

const ReviewRow = ({ label, value }: any) => (
  <View className="flex-row justify-between border-b border-border dark:border-dark-border pb-2 overflow-scroll">
    <LocalizedText sizeClass="text-sm" className="text-text-muted dark:text-dark-text-muted" numberOfLines={1} ellipsizeMode="tail">{label}</LocalizedText>
    <LocalizedText sizeClass="text-sm" className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail" marquee>{value}</LocalizedText>
  </View>
);