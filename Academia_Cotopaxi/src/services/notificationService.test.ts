import * as Notifications from "expo-notifications";
import { Linking, Platform, Vibration } from "react-native";
import {
  addNotificationResponseListener,
  ALARM_CATEGORY,
  ALARM_VIBRATION_PATTERN,
  cancelFinishNotification,
  dismissAllNotifications,
  getNotificationPermissionStatus,
  openNotificationSettings,
  requestNotificationPermission,
  scheduleFinishNotification,
  startAlarmVibration,
  stopAlarmVibration,
} from "./notificationService";

jest.mock("expo-notifications", () => ({
  AndroidImportance: { MAX: 5 },
  AndroidAudioUsage: { ALARM: 4 },
  AndroidAudioContentType: { SONIFICATION: 4 },
  AndroidNotificationVisibility: { PUBLIC: 1 },
  SchedulableTriggerInputTypes: { DATE: "date" },
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  setNotificationCategoryAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  dismissAllNotificationsAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
}));

describe("notification service with alarm channel and interactive actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Notifications.setNotificationChannelAsync as jest.Mock).mockResolvedValue(null);
    (Notifications.setNotificationCategoryAsync as jest.Mock).mockResolvedValue(null);
    (Notifications.dismissAllNotificationsAsync as jest.Mock).mockResolvedValue(null);
    jest.spyOn(Vibration, "vibrate").mockImplementation(() => {});
    jest.spyOn(Vibration, "cancel").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("configures android channel with ALARM usage and rhythmic vibration (RF-004, RF-005)", async () => {
    Platform.OS = "android";
    await requestNotificationPermission();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: ALARM_VIBRATION_PATTERN,
        audioAttributes: expect.objectContaining({
          usage: Notifications.AndroidAudioUsage.ALARM,
        }),
      }),
    );
  });

  it("configures interactive category with 'Detener' action (RF-010)", async () => {
    await requestNotificationPermission();

    expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
      ALARM_CATEGORY,
      expect.arrayContaining([
        expect.objectContaining({
          identifier: "STOP_ALARM",
          buttonTitle: "Detener",
          options: expect.objectContaining({ opensAppToForeground: false }),
        }),
      ]),
    );
  });

  it("schedules alarm notification with specific content and category (RF-006, RF-010)", async () => {
    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue("alarm-notif-1");

    const result = await scheduleFinishNotification(120_000, "study", "shortBreak", 5);

    expect(result).toEqual({
      available: true,
      notificationId: "alarm-notif-1",
    });
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: "¡Estudio terminado!",
          body: "Bien hecho. Listo para descanso corto (5 min)",
          categoryIdentifier: ALARM_CATEGORY,
        }),
      }),
    );
  });

  it("controls rhythmic alarm vibration and cancellation (RF-004, RF-009)", () => {
    startAlarmVibration();
    expect(Vibration.vibrate).toHaveBeenCalledWith(ALARM_VIBRATION_PATTERN, true);

    stopAlarmVibration();
    expect(Vibration.cancel).toHaveBeenCalled();
  });

  it("safely handles platforms or devices without vibration hardware (RF-012)", () => {
    jest.spyOn(Vibration, "vibrate").mockImplementationOnce(() => {
      throw new Error("No vibration hardware");
    });
    expect(() => startAlarmVibration()).not.toThrow();

    jest.spyOn(Vibration, "cancel").mockImplementationOnce(() => {
      throw new Error("Cancel failed");
    });
    expect(() => stopAlarmVibration()).not.toThrow();
  });

  it("dispatches 'stop' action when user taps 'Detener' on notification (RF-010)", () => {
    let listenerCallback!: (response: any) => void;
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementation(
      (handler) => {
        listenerCallback = handler;
        return { remove: jest.fn() };
      },
    );

    const onAction = jest.fn();
    const unsubscribe = addNotificationResponseListener(onAction);

    listenerCallback({
      actionIdentifier: "STOP_ALARM",
    });

    expect(onAction).toHaveBeenCalledWith("stop");
    unsubscribe();
  });

  it("dispatches 'open' action when user taps notification body (RF-011)", () => {
    let listenerCallback!: (response: any) => void;
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementation(
      (handler) => {
        listenerCallback = handler;
        return { remove: jest.fn() };
      },
    );

    const onAction = jest.fn();
    const unsubscribe = addNotificationResponseListener(onAction);

    listenerCallback({
      actionIdentifier: "DEFAULT",
    });

    expect(onAction).toHaveBeenCalledWith("open");
    unsubscribe();
  });

  it("dismisses all notifications from system drawer (RF-009, RF-010)", async () => {
    (Notifications.dismissAllNotificationsAsync as jest.Mock).mockResolvedValue(null);
    await expect(dismissAllNotifications()).resolves.toBeUndefined();
    expect(Notifications.dismissAllNotificationsAsync).toHaveBeenCalledTimes(1);
  });

  it("cancels exact notification when notificationId is provided", async () => {
    (Notifications.cancelScheduledNotificationAsync as jest.Mock).mockResolvedValue(null);
    await expect(cancelFinishNotification("test-notif-id")).resolves.toEqual({
      available: true,
    });
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith("test-notif-id");
  });

  it("checks notification permission status (RF-001, RF-003)", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "granted",
      canAskAgain: true,
    });
    await expect(getNotificationPermissionStatus()).resolves.toEqual({
      granted: true,
      canAskAgain: true,
    });

    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "denied",
      canAskAgain: false,
    });
    await expect(getNotificationPermissionStatus()).resolves.toEqual({
      granted: false,
      canAskAgain: false,
    });
  });

  it("opens application notification settings safely (RF-003)", async () => {
    const openSettingsSpy = jest.spyOn(Linking, "openSettings").mockResolvedValue();
    await openNotificationSettings();
    expect(openSettingsSpy).toHaveBeenCalledTimes(1);

    openSettingsSpy.mockRejectedValueOnce(new Error("Cannot open settings"));
    await expect(openNotificationSettings()).resolves.toBeUndefined();
  });
});
