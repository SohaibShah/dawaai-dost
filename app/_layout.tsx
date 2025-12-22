import React from 'react';
import { Stack } from 'expo-router';
import "../global.css"; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useStore } from '../store/useStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { NotificationService } from '../services/NotificationService';
import '../services/BackgroundNotificationHandler';
import GlobalAlert from '../components/GlobalAlert';
import OnboardingScreen from '../components/OnboardingScreen';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const themeSetting = useStore((state) => state.settings.theme);
  const { completed, showOnboarding, setShowOnboarding } = useOnboardingStore();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    NotificationService.registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    // Apply theme setting to NativeWind
    if (themeSetting === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(themeSetting);
    }
  }, [themeSetting, setColorScheme]);

  useEffect(() => {
    // Show onboarding on first launch
    if (!completed && !initialCheckDone) {
      setShowOnboarding(true);
      setInitialCheckDone(true);
    }
  }, [completed, initialCheckDone]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'default'
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        <GlobalAlert />
        
        {/* Onboarding Modal */}
        {showOnboarding && (
          <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
        )}
      </View>
    </GestureHandlerRootView>
  );
}