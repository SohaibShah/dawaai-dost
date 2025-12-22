import * as Haptics from 'expo-haptics';

const impactLight = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Ignore haptics errors silently
  }
};

const impactMedium = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Ignore haptics errors silently
  }
};

const notification = async (type: Haptics.NotificationFeedbackType) => {
  try {
    await Haptics.notificationAsync(type);
  } catch (error) {
    // Ignore haptics errors silently
  }
};

export const hapticTap = () => impactLight();
export const hapticDoubleTap = () => impactMedium();
export const hapticLongPress = () => notification(Haptics.NotificationFeedbackType.Warning);
export const hapticSuccess = () => notification(Haptics.NotificationFeedbackType.Success);
export const hapticError = () => notification(Haptics.NotificationFeedbackType.Error);
