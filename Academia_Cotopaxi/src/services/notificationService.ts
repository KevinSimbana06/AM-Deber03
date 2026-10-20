import { Linking, Platform, Vibration } from "react-native";
import type { PomodoroPhase } from "../types/pomodoro";
import { getAlarmNotificationContent } from "../utils/alarmMessages";

const CHANNEL_ID = "pomodoro-alarm";
export const ALARM_CATEGORY = "pomodoro-alarm-category";
export const ALARM_VIBRATION_PATTERN = [0, 500, 250, 500, 250, 500];

type NotificationResult =
  | { available: true }
  | { available: false; warning: string };

type NotificationsModule = typeof import("expo-notifications");

function loadNotifications(): NotificationsModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-notifications") as NotificationsModule;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationResult> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return {
      available: false,
      warning: "Los avisos no están disponibles en este entorno.",
    };
  }

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Alarma de fin de fase",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: ALARM_VIBRATION_PATTERN,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        },
      });
    }

    await Notifications.setNotificationCategoryAsync(ALARM_CATEGORY, [
      {
        identifier: "STOP_ALARM",
        buttonTitle: "Detener",
        options: {
          opensAppToForeground: false,
        },
      },
    ]);

    const current = await Notifications.getPermissionsAsync();
    const permission =
      current.status === "granted"
        ? current
        : await Notifications.requestPermissionsAsync();

    return permission.status === "granted"
      ? { available: true }
      : { available: false, warning: "El aviso de fin no está disponible." };
  } catch {
    return {
      available: false,
      warning: "No se pudo comprobar el aviso de fin.",
    };
  }
}

export async function scheduleFinishNotification(
  endTimestamp: number,
  phase: PomodoroPhase = "study",
  nextPhase?: PomodoroPhase,
  nextDurationMinutes?: number,
): Promise<NotificationResult & { notificationId?: string }> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return {
      available: false,
      warning: "Los avisos no están disponibles en este entorno.",
    };
  }

  const permission = await requestNotificationPermission();
  if (!permission.available) {
    return permission;
  }

  try {
    const determinedNextPhase: PomodoroPhase =
      nextPhase ?? (phase === "study" ? "shortBreak" : "study");
    const determinedMinutes: number =
      nextDurationMinutes ?? (determinedNextPhase === "longBreak" ? 15 : determinedNextPhase === "shortBreak" ? 5 : 25);
    const content = getAlarmNotificationContent(phase, determinedNextPhase, determinedMinutes);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        sound: "default",
        categoryIdentifier: ALARM_CATEGORY,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(endTimestamp),
        channelId: CHANNEL_ID,
      },
    });
    return { available: true, notificationId };
  } catch {
    return {
      available: false,
      warning: "No se pudo programar el aviso de fin.",
    };
  }
}

export async function cancelFinishNotification(
  notificationId: string | null,
): Promise<NotificationResult> {
  if (notificationId === null) {
    return { available: true };
  }

  const Notifications = loadNotifications();
  if (Notifications === null) {
    return {
      available: false,
      warning: "Los avisos no están disponibles en este entorno.",
    };
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return { available: true };
  } catch {
    return {
      available: false,
      warning: "No se pudo cancelar el aviso de fin.",
    };
  }
}

export async function dismissAllNotifications(): Promise<void> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return;
  }

  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {
    // Manejo silencioso seguro ante plataformas o entornos sin soporte
  }
}

export function startAlarmVibration(): void {
  try {
    Vibration.vibrate(ALARM_VIBRATION_PATTERN, true);
  } catch {
    // Tolerante ante dispositivos sin hardware de vibración (RF-012)
  }
}

export function stopAlarmVibration(): void {
  try {
    Vibration.cancel();
  } catch {
    // Tolerante ante fallos
  }
}

export function addNotificationResponseListener(
  callback: (action: "stop" | "open") => void,
): () => void {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return () => {};
  }

  try {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.actionIdentifier === "STOP_ALARM") {
          callback("stop");
        } else {
          callback("open");
        }
      },
    );
    return () => {
      subscription.remove();
    };
  } catch {
    return () => {};
  }
}

export async function getNotificationPermissionStatus(): Promise<{
  granted: boolean;
  canAskAgain: boolean;
}> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return { granted: false, canAskAgain: false };
  }

  try {
    const current = await Notifications.getPermissionsAsync();
    return {
      granted: current.status === "granted",
      canAskAgain: current.canAskAgain ?? (current.status !== "denied"),
    };
  } catch {
    return { granted: false, canAskAgain: false };
  }
}

export async function openNotificationSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch {
    // Tolerante ante fallos
  }
}
