import * as Haptics from 'expo-haptics';

const impactLight = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {}
};

const impactMedium = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {}
};

const notification = async (type: Haptics.NotificationFeedbackType) => {
  try {
    await Haptics.notificationAsync(type);
  } catch (error) {}
};

export const hapticTap = () => impactLight();
export const hapticDoubleTap = () => impactMedium();
export const hapticLongPress = () => notification(Haptics.NotificationFeedbackType.Warning);
export const hapticSuccess = () => notification(Haptics.NotificationFeedbackType.Success);
export const hapticError = () => notification(Haptics.NotificationFeedbackType.Error);
