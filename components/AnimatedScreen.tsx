import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from 'moti';

interface AnimatedScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}

export default function AnimatedScreen({ children, style, delay = 0 }: AnimatedScreenProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 20 }}
      transition={{ 
        type: 'timing', 
        duration: 350, 
        delay: delay 
      }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </MotiView>
  );
}