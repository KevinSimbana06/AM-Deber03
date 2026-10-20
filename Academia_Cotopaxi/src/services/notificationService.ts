import { Platform } from "react-native";

const CHANNEL_ID = "pomodoro-finish";

type NotificationResult =
  | { available: true }
  | { available: false; warning: string };

type NotificationsModule = typeof import("expo-notifications");

function loadNotifications(): NotificationsModule | null {
  try {
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
        name: "Fin de sesión",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

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
  phase: "study" | "shortBreak" | "longBreak" = "study",
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
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Fase finalizada",
        body: `${getPhaseLabel(phase)} terminó.`,
        sound: "default",
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

  function getPhaseLabel(phase: "study" | "shortBreak" | "longBreak"): string {
    if (phase === "shortBreak") return "El descanso corto";
    if (phase === "longBreak") return "El descanso largo";
    return "El estudio";
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
