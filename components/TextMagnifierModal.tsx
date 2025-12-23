import React from 'react';
import { Modal, View, TouchableOpacity, SafeAreaView } from 'react-native';
import LocalizedText from '@/components/LocalizedText';
import { useLocalization } from '@/utils/useLocalization';
import { useTextScale } from '@/utils/useTextScale';

interface TextMagnifierModalProps {
  visible: boolean;
  text: string;
  onClose: () => void;
}

export const TextMagnifierModal: React.FC<TextMagnifierModalProps> = ({
  visible,
  text,
  onClose,
}) => {
  const { getMagnifiedSize } = useTextScale();
  const { t } = useLocalization();

  const magnifiedFontSize = getMagnifiedSize('text-base');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black/70">
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1 items-center justify-center px-5"
        >
          <View className="bg-surface dark:bg-dark-surface rounded-2xl px-6 py-6 w-full max-h-[80%] items-center shadow-2xl border border-border/60 dark:border-dark-border/60">
            <LocalizedText
              style={{
                // fontSize: magnifiedFontSize,
                // lineHeight: magnifiedFontSize * 1.5,
                textAlign: 'center',
                fontWeight: '600',
                marginBottom: 24,
              }}
              className="text-text-main dark:text-dark-text-main text-4xl"
            >
              {text}
            </LocalizedText>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.85}
              className="bg-primary dark:bg-dark-primary rounded-xl py-4 px-8 min-w-[200px] items-center shadow-lg"
            >
              <LocalizedText
                // style={{ fontSize: magnifiedFontSize * 0.6, fontWeight: '700' }}
                className="text-white text-4xl"
              >
                {t('close') || 'Close'}
              </LocalizedText>
            </TouchableOpacity>
          </View>

          <LocalizedText
            style={{ fontSize: 14, marginTop: 16, textAlign: 'center', opacity: 0.8 }}
            className="text-white"
          >
            {t('tap_anywhere_to_close') || 'Tap anywhere to close'}
          </LocalizedText>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};
