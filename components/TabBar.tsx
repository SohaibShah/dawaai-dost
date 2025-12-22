import { View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabButton from './TabButton';
import AddButton from './AddButton';
import { Home, User } from 'lucide-react-native';
import React from 'react';
import { useLocalization } from '@/utils/useLocalization';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { t } = useLocalization();
  return (
    <View className="bg-background dark:bg-dark-background">
      <View className="flex-row bg-surface dark:bg-dark-surface h-28 items-center shadow-lg rounded-t-3xl border-t border-border dark:border-dark-border pb-2">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        
        const isAddButton = route.name === 'add';
        const Icon = route.name === 'index' ? Home : User; 
        const label = route.name === 'index' ? t('home') : t('profile');

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (state.index !== index && !event.defaultPrevented) {
            navigation.navigate(route.name);
          } else {
             navigation.navigate(route.name);
          }
        };

        if (isAddButton) {
          return (
             <View key={route.key} className="flex-1 items-center">
                <AddButton onPress={onPress} />
             </View>
          );
        }

        return (
          <TabButton
            key={route.key}
            onPress={onPress}
            accessibilityState={{ selected: state.index === index }}
            Icon={Icon}
            label={label}
          />
        );
      })}
    </View>
    </View>
  );
}