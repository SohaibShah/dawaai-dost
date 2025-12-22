import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { MotiView } from 'moti';
import { Plus } from 'lucide-react-native';

export default function AddButton({ onPress }: { onPress: () => void }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className="items-center justify-center -top-8" // Floating Effect
    >
      <MotiView
        className="bg-primary w-24 h-24 rounded-full items-center justify-center shadow-lg shadow-blue-500/50"
        from={{ scale: 1 }}
        animate={{ scale: isPressed ? 0.9 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {/* Inner Ring for Detail */}
        <View className="w-20 h-20 rounded-full border-2 border-white/30 items-center justify-center">
          <Plus size={36} color="white" strokeWidth={3} />
        </View>
      </MotiView>
    </Pressable>
  );
}