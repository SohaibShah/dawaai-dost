import React from 'react';
import { Pressable } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { LucideIcon } from 'lucide-react-native';
// Helper to toggle icon colors manually if needed, 
// but using semantic classes is better.
import { useColorScheme } from 'nativewind';
import LocalizedText from './LocalizedText';

interface TabButtonProps {
  onPress: () => void;
  accessibilityState: { selected?: boolean };
  Icon: LucideIcon;
  label: string;
}

export default function TabButton({ onPress, accessibilityState, Icon, label }: TabButtonProps) {
  const focused = accessibilityState.selected;
  const { colorScheme } = useColorScheme();

  // We can't use className on the Icon component directly for 'color' prop sometimes,
  // so we calculate the hex.
  // Primary Blue (#0EA5E9) vs Muted Gray (#94A3B8)
  const iconColor = focused 
    ? '#0EA5E9' 
    : (colorScheme === 'dark' ? '#94A3B8' : '#94A3B8'); 

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center justify-center pt-2"
    >
      <MotiView
        from={{ translateY: 0 }}
        animate={{ 
          translateY: focused ? -5 : 0,
          scale: focused ? 1.1 : 1 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Icon 
          size={28} 
          color={iconColor}
          strokeWidth={focused ? 3 : 2}
        />
      </MotiView>

      <MotiText
        className="mt-1"
        style={{ color: iconColor }}
        from={{ opacity: 0, translateY: 10 }}
        animate={{ 
          opacity: focused ? 1 : 0,
          translateY: focused ? 0 : 10
        }}
        transition={{ type: 'timing', duration: 200 }}
        pointerEvents="none"
      >
        {label}
      </MotiText>
    </Pressable>
  );
}