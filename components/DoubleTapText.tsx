import React, { useRef, useState } from 'react';
import { View, ViewProps } from 'react-native';

interface DoubleTapTextProps extends ViewProps {
  text: string;
  onDoubleTap: (text: string) => void;
  children: React.ReactNode;
}

export const DoubleTapText: React.FC<DoubleTapTextProps> = ({
  text,
  onDoubleTap,
  children,
  ...props
}) => {
  const lastTapRef = useRef<number>(0);
  const [isDoubleTap, setIsDoubleTap] = useState(false);

  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      setIsDoubleTap(true);
      onDoubleTap(text);
      setTimeout(() => setIsDoubleTap(false), 150);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <View
      {...props}
      onTouchEnd={handlePress}
      style={[
        props.style,
        isDoubleTap && { opacity: 0.6 },
      ]}
    >
      {children}
    </View>
  );
};
