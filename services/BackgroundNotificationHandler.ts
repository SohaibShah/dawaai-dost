import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
    if (error) return;

    const response = data as Notifications.NotificationResponse;
    const actionId = response.actionIdentifier;
    
    // Add null safety checks
    const notificationData = response.notification.request.content.data;
    if (!notificationData || typeof notificationData !== 'object') {
        console.warn('BackgroundNotificationHandler: No data found in notification');
        return;
    }
    
    const { medId, timeSlot } = notificationData;
    
    if (!medId || !timeSlot) {
        console.warn('BackgroundNotificationHandler: Missing medId or timeSlot', notificationData);
        return;
    }

    // NOTE: 'TAKE' is now handled by the foreground app (index.tsx)
    // because we set opensAppToForeground: true.

    if (actionId === 'SNOOZE') {
        try {
            // Schedule Snooze (Use Date trigger for reliability)
            const triggerDate = new Date();
            triggerDate.setMinutes(triggerDate.getMinutes() + 10);

            const snoozeNotifId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Snoozed: ${response.notification.request.content.title}`,
                    body: "Don't forget to take your meds!",
                    data: { medId, timeSlot },
                    categoryIdentifier: 'MEDICATION_ACTION',
                    color: '#FF231F7C',
                    sound: true,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                    channelId: 'medication-reminders',
                }
            });

            console.log(`BackgroundNotificationHandler: Snooze scheduled for ${triggerDate.toLocaleTimeString()}, ID: ${snoozeNotifId}`);

            // Dismiss the original
            await Notifications.dismissNotificationAsync(response.notification.request.identifier);
        } catch (error) {
            console.error('BackgroundNotificationHandler: Error scheduling snooze:', error);
        }
    }
});

(async () => {
    try {
        await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    } catch (e) {
        console.warn("Error registering background notification task:", e);
    }
})();