import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { AppState } from "react-native";
import { StudySessionProvider, useStudySession } from "./StudySessionContext";
import { createInitialSession } from "../utils/session";
import * as storage from "../storage/sessionStorage";
import * as notifications from "../services/notificationService";
import type { StudySession } from "../types/pomodoro";

jest.mock("../storage/sessionStorage", () => {
  const actual = jest.requireActual("../storage/sessionStorage");
  return {
    ...actual,
    loadStudySession: jest.fn(),
    saveStudySession: jest.fn(),
  };
});
jest.mock("../services/notificationService");

function Probe({ onValue }: { onValue: (value: ReturnType<typeof useStudySession>) => void }) {
  onValue(useStudySession());
  return null;
}

describe("StudySessionContext orchestrator", () => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(100_000);
    jest.mocked(storage.loadStudySession).mockResolvedValue(null);
    jest.mocked(storage.saveStudySession).mockResolvedValue();
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: true,
    });
    jest.mocked(notifications.scheduleFinishNotification).mockResolvedValue({
      available: true,
      notificationId: "notification-id-123",
    });
    jest.mocked(notifications.cancelFinishNotification).mockResolvedValue({
      available: true,
    });
    jest.mocked(notifications.dismissAllNotifications).mockResolvedValue();
    jest.mocked(notifications.startAlarmVibration).mockReturnValue();
    jest.mocked(notifications.stopAlarmVibration).mockReturnValue();
    jest.mocked(notifications.playAlarmWithFallback).mockResolvedValue({
      audioPlayed: false,
      vibrationStarted: true,
    });
    jest.mocked(notifications.addNotificationResponseListener).mockReturnValue(() => {});
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: true,
      canAskAgain: true,
    });
    jest.mocked(notifications.openNotificationSettings).mockResolvedValue();
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("dismisses system notifications upon mount", async () => {
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={() => {}} />
        </StudySessionProvider>,
      );
    });

    expect(notifications.dismissAllNotifications).toHaveBeenCalled();
  });

  it("restores a saved paused session intact within 24 hours (RF-005)", async () => {
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, 90_000),
      status: "paused",
      remainingSeconds: 900,
      notificationId: null,
      lastActiveTimestamp: 90_000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session).toMatchObject({
      status: "paused",
      remainingSeconds: 900,
    });
    expect(notifications.scheduleFinishNotification).not.toHaveBeenCalled();
  });

  it("restores running session with remaining time and reschedules notification (RF-002, RF-011)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, current - 10_000),
      status: "running",
      endTimestamp: current + 400_000, // 400s left
      notificationId: "old-notif-id",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.status).toBe("running");
    expect(value.session.remainingSeconds).toBe(400);
    expect(notifications.scheduleFinishNotification).toHaveBeenCalledWith(
      saved.endTimestamp,
      saved.phase,
    );
    expect(storage.saveStudySession).toHaveBeenCalled();
  });

  it("handles phase completed in absence when reopening within 24h (RF-004)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, current - 1_600_000),
      status: "running",
      endTimestamp: current - 100_000, // Ended in the past
      notificationId: "notif-done",
      completedPomodoros: 0,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.phase).toBe("shortBreak");
    expect(value.session.status).toBe("stopped");
    expect(value.session.completedPomodoros).toBe(1);
    expect(value.session.remainingSeconds).toBe(300);
    expect(value.info).toBe("La fase anterior terminó mientras la aplicación no estaba activa.");
    expect(storage.saveStudySession).toHaveBeenCalledWith(
      expect.objectContaining({ phase: "shortBreak", status: "stopped", completedPomodoros: 1 }),
    );
  });

  it("expires cycle after > 24 hours of inactivity (RF-008, RF-009)", async () => {
    const current = 100_000_000;
    jest.spyOn(Date, "now").mockReturnValue(current);
    const TWENTY_FIVE_HOURS = 25 * 60 * 60 * 1000;

    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: current - TWENTY_FIVE_HOURS,
      completedPomodoros: 2,
      notificationId: "notif-expired",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.phase).toBe("study");
    expect(value.session.status).toBe("stopped");
    expect(value.session.completedPomodoros).toBe(0);
    expect(value.session.remainingSeconds).toBe(1500);
    expect(value.info).toBe(
      "El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
    );
  });

  it("detects clock moved backwards and sets warning (RF-007)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      initialDurationSeconds: 1500,
      endTimestamp: current + 2_500_000, // 2500s > 1500s initial
      notificationId: "notif-clock",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.remainingSeconds).toBe(1500);
    expect(value.warning).toBe(
      "Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.",
    );
  });

  it("handles corrupt data by setting clear error and restoring clean session (RF-012)", async () => {
    jest
      .mocked(storage.loadStudySession)
      .mockRejectedValue(new storage.StorageError("invalid", "datos corruptos"));
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.phase).toBe("study");
    expect(value.session.status).toBe("stopped");
    expect(value.session.completedPomodoros).toBe(0);
    expect(value.error).toBe(
      "No se pudo recuperar la sesión anterior: los datos guardados no eran válidos. Se inició una nueva sesión.",
    );
    expect(storage.saveStudySession).toHaveBeenCalled();
  });

  it("cancels exact notification when pausing a restored running session (RF-006)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: current + 500_000,
      notificationId: "specific-notif-777",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.pause();
    });

    expect(value.session.status).toBe("paused");
    expect(value.session.notificationId).toBeNull();
    expect(notifications.cancelFinishNotification).toHaveBeenCalledWith("notification-id-123");
  });

  it("cancels exact notification on confirmed reset (RF-006)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });

    await act(async () => {
      await value.reset(true);
    });

    expect(value.session.status).toBe("stopped");
    expect(notifications.cancelFinishNotification).toHaveBeenCalledWith("notification-id-123");
  });

  it("handles AppState active event by synchronizing and dismissing notifications (RF-001, RF-010)", async () => {
    let appStateCallback!: (state: string) => void;
    jest.spyOn(AppState, "addEventListener").mockImplementation((_, handler) => {
      appStateCallback = handler as any;
      return { remove: jest.fn() } as any;
    });

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={() => {}} />
        </StudySessionProvider>,
      );
    });

    jest.mocked(notifications.dismissAllNotifications).mockClear();

    await act(async () => {
      appStateCallback("active");
    });

    expect(notifications.dismissAllNotifications).toHaveBeenCalled();
  });

  it("activates alarm, starts vibration and prepares next phase when running countdown hits zero (RF-004, RF-008)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000, // 1s left
      notificationId: "alarm-id",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    // Advance time by 1s
    jest.spyOn(Date, "now").mockReturnValue(100_000 + 1000);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);
    expect(value.alarmPhase).toBe("study");
    expect(notifications.startAlarmVibration).toHaveBeenCalled();
    expect(value.session.status).toBe("stopped");
    expect(value.session.phase).toBe("shortBreak");
  });

  it("silences alarm, stops vibration and dismisses notification when calling stopAlarm() (RF-009)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    jest.spyOn(Date, "now").mockReturnValue(100_000 + 1000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    await act(async () => {
      value.stopAlarm();
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
    expect(notifications.dismissAllNotifications).toHaveBeenCalled();
  });

  it("automatically cuts off alarm after 60 seconds (RF-007)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    // Finish phase at 101_000
    jest.spyOn(Date, "now").mockReturnValue(101_000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    // Advance 60 seconds of alarm
    jest.spyOn(Date, "now").mockReturnValue(101_000 + 60_000);
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
  });

  it("silences alarm on remote 'stop' notification action (RF-010)", async () => {
    let responseHandler!: (action: "stop" | "open") => void;
    jest
      .mocked(notifications.addNotificationResponseListener)
      .mockImplementation((handler) => {
        responseHandler = handler;
        return () => {};
      });

    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    jest.spyOn(Date, "now").mockReturnValue(101_000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    await act(async () => {
      responseHandler("stop");
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
  });

  it("silences alarm on notification body tap 'open' (RF-011)", async () => {
    let responseHandler!: (action: "stop" | "open") => void;
    jest
      .mocked(notifications.addNotificationResponseListener)
      .mockImplementation((handler) => {
        responseHandler = handler;
        return () => {};
      });

    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    jest.spyOn(Date, "now").mockReturnValue(101_000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    await act(async () => {
      responseHandler("open");
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
  });

  it("presents permission explanatory modal when starting timer for the first time without permission (RF-001)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.isPermissionModalVisible).toBe(false);

    await act(async () => {
      await value.start();
    });

    expect(value.isPermissionModalVisible).toBe(true);
    expect(value.session.status).toBe("stopped");
    expect(notifications.scheduleFinishNotification).not.toHaveBeenCalled();
  });

  it("starts session and schedules notification when user confirms permission modal with granted permission (RF-001, RF-002)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    await act(async () => {
      await value.confirmPermissionModal();
    });

    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
    expect(notifications.scheduleFinishNotification).toHaveBeenCalled();
    expect(value.warning).toBeNull();
  });

  it("starts session anyway and sets visible non-blocking warning when permission is denied in modal (RF-002)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: false,
      warning: "El aviso de fin no está disponible.",
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    await act(async () => {
      await value.confirmPermissionModal();
    });

    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
    expect(value.warning).toContain("No recibirás avisos fuera de la app");
  });

  it("allows student to continue without permission from modal, starting session with non-blocking warning (RF-002)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    await act(async () => {
      await value.dismissPermissionModal();
    });

    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
    expect(value.warning).toContain("No recibirás avisos fuera de la app");
  });

  it("invokes openNotificationSettings to allow navigating to system settings (RF-003)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.openNotificationSettings();
    });

    expect(notifications.openNotificationSettings).toHaveBeenCalledTimes(1);
  });

  it("degrades smoothly to memory and sets non-blocking warning when saveStudySession fails on start (RF-007, Decisión 4)", async () => {
    jest.mocked(storage.saveStudySession).mockRejectedValueOnce(new Error("Storage disk full"));

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });

    // Sesión debe continuar en memoria como "running", sin revertirse ni congelarse
    expect(value.session.status).toBe("running");
    expect(value.warning).toContain("memoria");
    expect(value.error).toBeNull();
  });

  it("degrades smoothly to memory when saveStudySession fails on pause (RF-007)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.session.status).toBe("running");

    jest.mocked(storage.saveStudySession).mockRejectedValueOnce(new Error("Storage write failure"));

    await act(async () => {
      await value.pause();
    });

    // Sesión debe pausarse en memoria con advertencia no bloqueante
    expect(value.session.status).toBe("paused");
    expect(value.warning).toContain("memoria");
  });

  it("does not re-prompt notification permission modal on subsequent starts after user dismissed it (RF-008, Decisión 6)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    // Primer inicio: abre modal
    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    // Usuario descarta el modal para continuar sin avisos
    await act(async () => {
      await value.dismissPermissionModal();
    });
    expect(value.session.status).toBe("running");

    // Pausa la sesión
    await act(async () => {
      await value.pause();
    });
    expect(value.session.status).toBe("paused");

    // Segundo inicio: arranca directo sin volver a mostrar el modal
    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
  });

  it("restores phase completed in absence offline and triggers alarm with safe vibration (RF-004, RF-009, Decisión 7)", async () => {
    // Sesión que expiró mientras la app estaba cerrada (now: 100_000, endTimestamp: 80_000)
    const expiredSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, 50_000),
      status: "running",
      remainingSeconds: 0,
      endTimestamp: 80_000,
      notificationId: "old-notif-id",
      lastActiveTimestamp: 50_000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValueOnce(expiredSession);

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.isAlarmActive).toBe(true);
    expect(notifications.playAlarmWithFallback).toHaveBeenCalled();
  });
});
