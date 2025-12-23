import { useStore } from '@/store/useStore';
import { StyleProp, TextStyle } from 'react-native';

const BASE_FONT_SIZES: Record<string, number> = {
  'text-xs': 12,
  'text-sm': 14,
  'text-base': 16,
  'text-lg': 18,
  'text-xl': 20,
  'text-2xl': 24,
  'text-3xl': 30,
  'text-4xl': 36,
};

export function useTextScale() {
  const textScale = useStore((state) => state.settings.textScale);

  const getScaledSize = (baseSize: string | number): number => {
    let baseSizePixels: number;

    if (typeof baseSize === 'number') {
      baseSizePixels = baseSize;
    } else if (BASE_FONT_SIZES[baseSize]) {
      baseSizePixels = BASE_FONT_SIZES[baseSize];
    } else {
      baseSizePixels = 16;
    }

    return Math.round(baseSizePixels * textScale * 10) / 10;
  };

  const getMagnifiedSize = (baseSize: string | number): number => {
    const scaledSize = getScaledSize(baseSize);
    return Math.round(scaledSize * 2.5 * 10) / 10;
  };

  const getScaleMultiplier = (): 1 | 1.25 | 1.5 | 1.75 => {
    return textScale;
  };

  const scaleValue = (value: number): number => {
    return Math.round(value * textScale * 10) / 10;
  };

  return {
    textScale,
    getScaledSize,
    getMagnifiedSize,
    getScaleMultiplier,
    scaleValue,
  };
}
