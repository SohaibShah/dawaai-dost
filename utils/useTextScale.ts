import { useStore } from '@/store/useStore';
import { StyleProp, TextStyle } from 'react-native';

/**
 * Gets numeric pixel sizes for each Tailwind font size class
 */
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

/**
 * Hook to get scaled font sizes and styling based on user's textScale preference
 * 
 * Usage:
 * const { getScaledSize, getMagnifiedSize } = useTextScale();
 * 
 * // For inline styles (recommended):
 * <Text style={{ fontSize: getScaledSize('text-base') }}>Text</Text>
 * 
 * // For magnifier:
 * <Text style={{ fontSize: getMagnifiedSize('text-lg') }}>Large Text</Text>
 */
export function useTextScale() {
  const textScale = useStore((state) => state.settings.textScale);

  /**
   * Get scaled font size in pixels for a given base size
   * @param baseSize - Tailwind class name or numeric pixel size
   * @returns Scaled pixel size
   */
  const getScaledSize = (baseSize: string | number): number => {
    let baseSizePixels: number;

    if (typeof baseSize === 'number') {
      baseSizePixels = baseSize;
    } else if (BASE_FONT_SIZES[baseSize]) {
      baseSizePixels = BASE_FONT_SIZES[baseSize];
    } else {
      // Fallback to 16 if not found
      baseSizePixels = 16;
    }

    return Math.round(baseSizePixels * textScale * 10) / 10;
  };

  /**
   * Get magnified font size for the double-tap magnifier (2.5x magnification)
   * @param baseSize - Tailwind class name or numeric pixel size
   * @returns Magnified pixel size
   */
  const getMagnifiedSize = (baseSize: string | number): number => {
    const scaledSize = getScaledSize(baseSize);
    return Math.round(scaledSize * 2.5 * 10) / 10;
  };

  /**
   * Get the current scale multiplier
   */
  const getScaleMultiplier = (): 1 | 1.25 | 1.5 | 1.75 => {
    return textScale;
  };

  /**
   * Scale a numeric value by the current text scale
   * Useful for padding, margins, etc.
   * @param value - Base numeric value
   * @returns Scaled numeric value
   */
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
