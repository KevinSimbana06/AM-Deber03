import * as Notifications from "expo-notifications";
import {
  cancelFinishNotification,
  requestNotificationPermission,
  scheduleFinishNotification,
} from "./notificationService";

jest.mock("expo-notifications", () => ({
  AndroidImportance: { MAX: 5 },
  SchedulableTriggerInputTypes: { DATE: "date" },
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
}));

describe("notification service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Notifications.setNotificationChannelAsync as jest.Mock).mockResolvedValue(null);
  });

  it("reports granted permission and schedules a finish notification", async () => {
    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue("id");

    await expect(requestNotificationPermission()).resolves.toEqual({
      available: true,
    });
    await expect(scheduleFinishNotification(120_000)).resolves.toEqual({
      available: true,
      notificationId: "id",
    });
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({ title: "Fase finalizada" }),
      }),
    );
  });

  it("reports unavailable permission without blocking the timer", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    await expect(requestNotificationPermission()).resolves.toEqual({
      available: false,
      warning: expect.any(String),
    });
  });

  it("reports scheduling failures and cancels an existing notification", async () => {
    (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
      new Error("unavailable"),
    );
    await expect(scheduleFinishNotification(120_000)).resolves.toEqual({
      available: false,
      warning: expect.any(String),
    });

    await expect(cancelFinishNotification("id")).resolves.toEqual({
      available: true,
    });
  });
});
