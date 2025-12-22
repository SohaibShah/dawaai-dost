import React from 'react';
import { Stack } from 'expo-router';
import "../global.css"; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useStore } from '../store/useStore';
import { NotificationService } from '../services/NotificationService';
import '../services/BackgroundNotificationHandler';
import GlobalAlert from '../components/GlobalAlert';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const themeSetting = useStore((state) => state.settings.theme);

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
      </View>
    </GestureHandlerRootView>
  );
}