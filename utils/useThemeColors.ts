import { useStore } from '../store/useStore';
import { useColorScheme } from 'nativewind';

export const THEME_COLORS = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceHighlight: '#F1F5F9',
    primary: '#0EA5E9',
    primaryFg: '#FFFFFF',
    secondary: '#6366F1',
    secondaryFg: '#FFFFFF',
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    error: '#F43F5E',
    errorBg: '#FFF1F2',
    textMain: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceHighlight: '#334155',
    primary: '#38BDF8',
    primaryFg: '#0F172A',
    secondary: '#818CF8',
    secondaryFg: '#0F172A',
    success: '#34D399',
    successBg: '#064E3B',
    warning: '#FBBF24',
    warningBg: '#78350F',
    error: '#FB7185',
    errorBg: '#881337',
    textMain: '#F1F5F9',
    textMuted: '#94A3B8',
    border: '#334155',
  },
};

// High contrast palette - bold, saturated colors for maximum visibility
export const THEME_COLORS_HIGH_CONTRAST = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceHighlight: '#E0E0E0',
    primary: '#0051BA', // Deep blue
    primaryFg: '#FFFFFF',
    secondary: '#4400CC', // Deep purple
    secondaryFg: '#FFFFFF',
    success: '#007F00', // Deep green
    successBg: '#CCFFCC',
    warning: '#FF6600', // Deep orange
    warningBg: '#FFCC99',
    error: '#CC0000', // Deep red
    errorBg: '#FFCCCC',
    textMain: '#000000',
    textMuted: '#333333',
    border: '#000000',
  },
  dark: {
    background: '#000000',
    surface: '#1A1A1A',
    surfaceHighlight: '#404040',
    primary: '#00CCFF', // Bright cyan
    primaryFg: '#000000',
    secondary: '#FFFF00', // Bright yellow
    secondaryFg: '#000000',
    success: '#00FF00', // Bright green
    successBg: '#003300',
    warning: '#FFFF00', // Bright yellow
    warningBg: '#333300',
    error: '#FF0000', // Bright red
    errorBg: '#330000',
    textMain: '#FFFFFF',
    textMuted: '#CCCCCC',
    border: '#FFFFFF',
  },
};

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const { theme: themeSetting, highContrast } = useStore((state) => state.settings);
  
  // Determine actual theme based on setting (system, light, or dark)
  const actualTheme = themeSetting === 'system' ? colorScheme : themeSetting;
  const isDark = actualTheme === 'dark';
  
  // Select palette based on high contrast setting
  const palette = highContrast ? THEME_COLORS_HIGH_CONTRAST : THEME_COLORS;
  
  return {
    colors: isDark ? palette.dark : palette.light,
    isDark,
    theme: actualTheme,
  };
}
