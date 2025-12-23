import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medicine } from '../store/useStore';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const NotificationService = {
    registerForPushNotificationsAsync: async () => {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('medication-reminders', {
                name: 'Medication Reminders',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') return;

        await Notifications.setNotificationCategoryAsync('MEDICATION_ACTION', [
            {
                identifier: 'TAKE',
                buttonTitle: 'Take Now',
                options: { opensAppToForeground: true }
            },
            {
                identifier: 'SNOOZE',
                buttonTitle: 'Snooze 10m',
                options: { opensAppToForeground: false }
            },
        ]);
    },

    scheduleMedicationReminder: async (med: Medicine) => {
        await NotificationService.cancelAllForMed(med.id);

        for (const timeSlot of med.timeSlots) {
            const cleanSlot = timeSlot.trim();
            const match = cleanSlot.match(/(\d+):(\d+)\s?(AM|PM)/i);

            if (!match) {
                console.warn(`[Notification] Skipping invalid time slot: ${timeSlot}`);
                continue;
            }

            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const period = match[3].toUpperCase();

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const mainId = `${med.id}_${timeSlot}_MAIN`;
            const lateId = `${med.id}_${timeSlot}_LATE`;

            await Notifications.scheduleNotificationAsync({
                identifier: mainId,
                content: {
                    title: `Time for ${med.name}`,
                    body: `Dose: ${med.dosage}. Tap to confirm.`,
                    sound: true,
                    categoryIdentifier: 'MEDICATION_ACTION',
                    data: { medId: med.id, timeSlot: timeSlot, type: 'main' },
                    ...(Platform.OS === 'android' && { color: '#FF231F7C' }),
                },
                trigger: {
                    type: Platform.OS !== 'android' ? Notifications.SchedulableTriggerInputTypes.CALENDAR : Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: hours,
                    minute: minutes,
                    repeats: true,
                },
            });

            let lateH = hours;
            let lateM = minutes + 30;
            if (lateM >= 60) {
                lateH = (lateH + 1) % 24;
                lateM -= 60;
            }

            await Notifications.scheduleNotificationAsync({
                identifier: lateId,
                content: {
                    title: `⚠️ Missed Dose: ${med.name}`,
                    body: `You missed your ${timeSlot} dose. Please take it now.`,
                    sound: true,
                    categoryIdentifier: 'MEDICATION_ACTION',
                    data: { medId: med.id, timeSlot: timeSlot, type: 'late' },
                    ...(Platform.OS === 'android' && { color: '#FF231F7C' }),
                },
                trigger: {
                    type: Platform.OS !== 'android' ? Notifications.SchedulableTriggerInputTypes.CALENDAR : Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: lateH,
                    minute: lateM,
                    repeats: true,
                },
            });
        }
    },

    cancelLateReminder: async (medId: string, timeSlot: string) => {
        const lateId = `${medId}_${timeSlot}_LATE`;
        await Notifications.cancelScheduledNotificationAsync(lateId);
    },

    cancelAllForMed: async (medId: string) => {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        for (const notif of scheduled) {
            if (notif.identifier.startsWith(`${medId}_`)) {
                await Notifications.cancelScheduledNotificationAsync(notif.identifier);
            }
        }
    },

    rescheduleLateReminder: async (med: Medicine) => {
        await NotificationService.scheduleMedicationReminder(med);
    },

    snoozeNotification: async (content: any) => {
        const triggerDate = new Date();
        triggerDate.setMinutes(triggerDate.getMinutes() + 10);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Snoozed: ${content.title}`,
                body: content.body,
                sound: true,
                categoryIdentifier: 'MEDICATION_ACTION',
                data: content.data,
                color: '#FF231F7C',
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate // Explicit timestamp
            },
        });
    }
};