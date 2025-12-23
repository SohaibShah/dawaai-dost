import React, { useState } from 'react';
import { View, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import LocalizedText from './LocalizedText';
import { useStore } from '@/store/useStore';
import { X, Camera, Save, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti';
import { useLocalization } from '@/utils/useLocalization';

export default function EditProfileModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const { t } = useLocalization();
  const { settings, updateSettings } = useStore();
  const [name, setName] = useState(settings.userName);
  const [photo, setPhoto] = useState(settings.userPhoto);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    updateSettings({ userName: name, userPhoto: photo });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <MotiView from={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-surface dark:bg-dark-surface w-full rounded-3xl p-6 border border-border dark:border-dark-border">
          <View className="flex-row justify-between items-center mb-6">
            <LocalizedText sizeClass="text-2xl" className="font-bold text-text-main dark:text-dark-text-main" numberOfLines={1} ellipsizeMode="tail" marquee>{t('edit_profile')}</LocalizedText>
            <TouchableOpacity onPress={onClose}><X size={24} color="#94A3B8"/></TouchableOpacity>
          </View>

          <View className="self-center mb-6 relative">
            <View className="h-32 w-32 rounded-full bg-surface-highlight dark:bg-dark-surface-highlight overflow-hidden border-4 border-surface dark:border-dark-border shadow-lg">
              {photo ? <Image source={{ uri: photo }} className="h-full w-full" /> : <View className="flex-1 items-center justify-center"><User size={40} color="#CBD5E1"/></View>}
            </View>
            <TouchableOpacity onPress={pickImage} className="absolute bottom-0 right-0 bg-primary dark:bg-dark-primary p-3 rounded-full border-4 border-surface dark:border-dark-border">
              <Camera size={20} color="white" />
            </TouchableOpacity>
          </View>

          <LocalizedText className="text-text-muted dark:text-dark-text-muted font-bold uppercase mb-2" sizeClass="text-xs">{t('display_name')}</LocalizedText>
          <TextInput 
            value={name} onChangeText={setName} 
            className="bg-background dark:bg-dark-background p-4 rounded-xl text-lg text-text-main dark:text-dark-text-main border border-border dark:border-dark-border mb-8"
          />

          <TouchableOpacity onPress={handleSave} className="bg-primary dark:bg-dark-primary py-4 rounded-xl items-center">
            <LocalizedText sizeClass="text-lg" className="text-white font-bold" numberOfLines={1} ellipsizeMode="tail">{t('save_profile')}</LocalizedText>
          </TouchableOpacity>
        </MotiView>
      </View>
    </Modal>
  );
}