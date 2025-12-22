import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import LocalizedText from '../../components/LocalizedText';
import { useStore, Medicine } from '../../store/useStore';
import { useAlertStore } from '../../store/alertStore'; // NEW: Import Alert Store
import { useLocalization } from '@/utils/useLocalization';
import AnimatedScreen from '../../components/AnimatedScreen';
import MedicineCard from '../../components/MedicineCard';
import ConfirmationModal from '../../components/ConfirmationModal';
import EditMedicineModal from '../../components/EditMedicineModal';
import { Sun, Moon, CloudSun, Clock, CalendarDays, Zap } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Layout } from 'react-native-reanimated'; // For smooth list reordering
import Svg, { Circle } from 'react-native-svg';
import * as Notifications from 'expo-notifications';
import { NotificationService } from '@/services/NotificationService';
import { useOnboardingStore } from '@/store/onboardingStore';


// --- Semantic Section Title ---
const SectionTitle = ({ titleKey, count }: { titleKey: string, count: number }) => {
  const { t } = useLocalization();
  return (
  <View className="flex-row items-center mb-4 mt-6 justify-between">
    <View className="flex-row items-center">
      <View className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mr-3">
        {titleKey === 'to_take' ?
          <Clock size={16} color="#0EA5E9" /> :
          <CalendarDays size={16} color="#10B981" />
        }
      </View>
      <LocalizedText className="text-xl font-bold text-text-main dark:text-dark-text-main">{t(titleKey)}</LocalizedText>
    </View>
    {count >= 0 && (
      <View className="bg-surface-highlight dark:bg-dark-surface-highlight px-3 py-1 rounded-full border border-border dark:border-dark-border">
        <LocalizedText className="text-xs font-bold text-text-muted dark:text-dark-text-muted">{count}</LocalizedText>
      </View>
    )}
  </View>
);
};

export default function HomeScreen() {
  const { medicines, toggleDose, getTakenCount, checkAdherence, removeMedicine, settings } = useStore();
  const { showAlert } = useAlertStore(); // NEW: Use Custom Alert
  const { t, getMedicineName } = useLocalization();

  const [refreshing, setRefreshing] = useState(false);
  const [hour, setHour] = useState(new Date().getHours());

  // MODAL STATES
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [selectedDose, setSelectedDose] = useState<string | null>(null);
  const [isDoseTaken, setIsDoseTaken] = useState<boolean>(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // INTELLIGENCE
  const [suggestion, setSuggestion] = useState<{ id: string, text: string } | null>(null);
  const { setTargetIfEmpty } = useOnboardingStore();
  const suggestionRef = useRef<any>(null);

  // NOTIFICATION LISTENER REFS
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // 1. Setup & Schedule
    NotificationService.registerForPushNotificationsAsync();
    medicines.forEach(m => NotificationService.scheduleMedicationReminder(m));

    // 2. Listen for clicks/actions
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const actionId = response.actionIdentifier;
      const data = response.notification.request.content.data;
      const med = medicines.find(m => m.id === data.medId);

      if (actionId === 'SNOOZE') {
        NotificationService.snoozeNotification(response.notification.request.content);
      } else if (med) {
        setSelectedMed(med);
        setSelectedDose(data.timeSlot as string);
        setIsDoseTaken(false);
        setIsConfirmModalVisible(true);
      }
    });

    // 3. Run Intelligence Check
    for (const med of medicines) {
      const msg = checkAdherence(med.id);
      if (msg) {
        setSuggestion({ id: med.id, text: msg });
        break;
      }
    }

    return () => {
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  useEffect(() => { setHour(new Date().getHours()); }, []);

  useEffect(() => {
    // Measure suggestion banner after initial render
    setTimeout(() => {
      if (suggestionRef.current && suggestionRef.current.measureInWindow) {
        suggestionRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
          setTargetIfEmpty('suggestionBanner', { x, y, width, height, borderRadius: 24 });
        });
      }
    }, 500);
  }, [suggestion]);

  const onRefresh = () => {
    setRefreshing(true);
    // Re-run checks on refresh
    setHour(new Date().getHours());
    setTimeout(() => setRefreshing(false), 500);
  };

  // --- HANDLERS ---

  const handleLongPress = (med: Medicine) => {
    // NEW: Use Custom Alert instead of Native Alert
    showAlert({
      title: t('manage_medicine'),
      message: `${t('what_would_you_like')} ${getMedicineName(med.name)}؟`,
      type: 'info',
      confirmText: t('edit_details'),
      onConfirm: () => {
        setSelectedMed(med);
        setIsEditModalVisible(true);
      },
      cancelText: t('delete_action'),
      onCancel: () => {
        // Show a second confirmation for safety
        setTimeout(() => {
          showAlert({
            title: t('delete_medicine_confirm'),
            message: t('action_cannot_undone'),
            type: 'error',
            confirmText: t('delete'),
            onConfirm: () => removeMedicine(med.id),
            cancelText: t('cancel'),
            onCancel: () => { }, // No action
          });
        }, 200);
      },



      neutralText: t('close_menu'),
      onNeutral: () => { }
    });
  };

  const handleDosePress = (med: Medicine, timeSlot: string, isTaken: boolean) => {
    setSelectedMed(med);
    setSelectedDose(timeSlot);
    setIsDoseTaken(isTaken);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmTaken = () => {
    if (selectedMed && selectedDose) {
      toggleDose(selectedMed.id, selectedDose);
      setIsConfirmModalVisible(false);
      setSelectedMed(null);
      setSelectedDose(null);
      setSuggestion(null);
    }
  };

  // --- TIME THEME ENGINE (Now Dark Mode Aware) ---
  const getTimeTheme = () => {
    if (hour < 12) return {
      greeting: t('good_morning'),
      icon: Sun,
      color: '#F59E0B',
      bg: 'bg-orange-50 dark:bg-orange-950',
      text: 'text-orange-900 dark:text-orange-100',
      border: 'border-orange-200 dark:border-orange-800'
    };
    if (hour < 18) return {
      greeting: t('good_afternoon'),
      icon: CloudSun,
      color: '#0EA5E9',
      bg: 'bg-sky-50 dark:bg-sky-950',
      text: 'text-sky-900 dark:text-sky-100',
      border: 'border-sky-200 dark:border-sky-800'
    };
    return {
      greeting: t('good_evening'),
      icon: Moon,
      color: '#6366F1',
      bg: 'bg-indigo-50 dark:bg-indigo-950',
      text: 'text-indigo-900 dark:text-indigo-100',
      border: 'border-indigo-200 dark:border-indigo-800'
    };
  };

  const theme = getTimeTheme();
  const Icon = theme.icon;

  // Stats Logic
  const totalDoses = medicines.reduce((acc, med) => acc + med.timeSlots.length, 0);
  const takenTotal = medicines.reduce((acc, med) => acc + getTakenCount(med.id), 0);
  const progressPercent = totalDoses > 0 ? (takenTotal / totalDoses) * 100 : 0;

  // SVG Math
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle="dark-content" className="dark:!light-content" />

      {/* --- HEADER ANIMATION: Slide Down + Gentle Float --- */}
      <MotiView
        from={{ translateY: -150 }}
        animate={{ translateY: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className={`pt-16 pb-8 px-6 rounded-b-[40px] shadow-sm z-10 ${theme.bg}`}
      >
        <MotiView
          from={{ translateY: 0 }}
          animate={{ translateY: -5 }}
          transition={{ loop: true, type: 'timing', duration: 3000 }} // Float effect
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1 min-w-0">
              <LocalizedText className={`font-bold text-xs uppercase tracking-widest mb-1 opacity-80 ${theme.text}`} numberOfLines={1} ellipsizeMode="tail">
                {new Date().toDateString()}
              </LocalizedText>
              <View className="flex-row items-center min-w-0">
                <LocalizedText className={`text-3xl font-bold mr-3 ${theme.text}`} numberOfLines={1} ellipsizeMode="tail" marquee sizeClass="text-3xl">
                  {theme.greeting}
                </LocalizedText>
                <Icon size={32} color={theme.color} />
              </View>
              <LocalizedText className={`mt-2 text-base font-medium opacity-80 ${theme.text}`} numberOfLines={1} ellipsizeMode="tail" marquee sizeClass="text-base">
                {totalDoses === 0 ? t('no_medicines_scheduled') : t('doses_left').replace('{count}', String(totalDoses - takenTotal))}
              </LocalizedText>
            </View>

            {/* Progress Circle */}
            <View className="items-center justify-center relative w-16 h-16 shrink-0">
              <Svg width="64" height="64" viewBox="0 0 64 64">
                <Circle
                  cx="32" cy="32" r={radius}
                  stroke={theme.color}
                  strokeWidth="6"
                  opacity="0.2"
                  fill="transparent"
                />
                <Circle
                  cx="32" cy="32" r={radius}
                  stroke={theme.color}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="32, 32"
                />
              </Svg>
              <View className="absolute inset-0 items-center justify-center">
                <LocalizedText className={`font-bold text-xs ${theme.text}`} sizeClass="text-xs">{Math.round(progressPercent)}%</LocalizedText>
              </View>
            </View>
          </View>
        </MotiView>
      </MotiView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <AnimatedScreen>

          {/* --- SMART SUGGESTIONS BANNER --- */}
          {suggestion && (
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-surface dark:bg-dark-surface border border-purple-200 dark:border-purple-800 p-4 rounded-3xl mb-6 shadow-sm flex-row items-center"
              ref={suggestionRef}
            >
              <View className="bg-purple-100 dark:bg-purple-900 p-2.5 rounded-lg mr-3">
                <Zap size={18} color={settings.theme === 'dark' ? '#d8b4fe' : '#9333EA'} />
              </View>
              <View className="flex-1">
                <LocalizedText className="font-bold text-text-main dark:text-dark-text-main text-sm">{t('smart_suggestions_title')}</LocalizedText>
                <LocalizedText className="text-text-muted dark:text-dark-text-muted text-xs">{t('check_medicines_tips')}</LocalizedText>
              </View>
            </MotiView>
          )}

          {/* --- EMPTY STATE --- */}
          {medicines.length === 0 ? (
            <View className="items-center py-20">
              <View className="bg-surface-highlight dark:bg-dark-surface-highlight p-6 rounded-full mb-4">
                <CalendarDays size={60} color={settings.theme === 'dark' ? '#94A3B8' : '#64748B'} />
              </View>
              <LocalizedText className="text-text-muted dark:text-dark-text-muted mt-4 font-bold text-lg">{t('no_medicines_title')}</LocalizedText>
              <LocalizedText className="text-text-muted dark:text-dark-text-muted opacity-60 text-center w-64">
                {t('add_first_prescription')}
              </LocalizedText>
            </View>
          ) : (
            <MotiView layout={Layout.springify()}>
              {/* --- TO TAKE SECTION --- */}
              {(() => {
                const pendingMeds = medicines.filter(med => {
                  const taken = getTakenCount(med.id);
                  return taken < med.timeSlots.length;
                });
                
                return pendingMeds.length > 0 ? (
                  <>
                    <SectionTitle titleKey="to_take" count={pendingMeds.reduce((acc, med) => acc + (med.timeSlots.length - getTakenCount(med.id)), 0)} />
                    {pendingMeds.map((med) => (
                      <View key={med.id}>
                        <MedicineCard
                          med={med}
                          onLongPress={() => handleLongPress(med)}
                          onDosePress={(time, isTaken) => handleDosePress(med, time, isTaken)}
                          suggestion={suggestion?.id === med.id ? {
                            text: suggestion.text,
                            onEdit: () => { setSelectedMed(med); setIsEditModalVisible(true); }
                          } : undefined}
                          isDarkMode={settings.theme === 'dark'}
                        />
                      </View>
                    ))}
                  </>
                ) : null;
              })()}

              {/* --- COMPLETED SECTION --- */}
              {(() => {
                const completedMeds = medicines.filter(med => {
                  const taken = getTakenCount(med.id);
                  return taken === med.timeSlots.length && taken > 0;
                });
                
                return completedMeds.length > 0 ? (
                  <>
                    <SectionTitle titleKey="completed_today" count={completedMeds.length} />
                    {completedMeds.map((med) => (
                      <View key={med.id}>
                        <MedicineCard
                          med={med}
                          onLongPress={() => handleLongPress(med)}
                          onDosePress={(time, isTaken) => handleDosePress(med, time, isTaken)}
                          suggestion={suggestion?.id === med.id ? {
                            text: suggestion.text,
                            onEdit: () => { setSelectedMed(med); setIsEditModalVisible(true); }
                          } : undefined}
                          isDarkMode={settings.theme === 'dark'}
                        />
                      </View>
                    ))}
                  </>
                ) : null;
              })()}
            </MotiView>
          )}
        </AnimatedScreen>
      </ScrollView>

      {/* --- MODALS --- */}
      <ConfirmationModal
        visible={isConfirmModalVisible}
        med={selectedMed}
        isTaken={isDoseTaken}
        onConfirm={handleConfirmTaken}
        onCancel={() => { setIsConfirmModalVisible(false); setSelectedMed(null); }}
      />

      <EditMedicineModal
        visible={isEditModalVisible}
        med={selectedMed}
        onClose={() => { setIsEditModalVisible(false); setSelectedMed(null); }}
      />
    </View>
  );
}