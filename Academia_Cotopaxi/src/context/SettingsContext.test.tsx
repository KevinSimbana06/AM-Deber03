import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { SettingsProvider, useSettings } from "./SettingsContext";
import { StudySessionProvider, useStudySession } from "./StudySessionContext";
import * as settingsStorage from "../storage/settingsStorage";
import * as sessionStorage from "../storage/sessionStorage";
import * as notifications from "../services/notificationService";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";
import { createInitialSession } from "../utils/session";
import type { PomodoroSettings, StudySession } from "../types/pomodoro";

jest.mock("../storage/settingsStorage");
jest.mock("../storage/sessionStorage");
jest.mock("../services/notificationService");

function SettingsProbe({ onValue }: { onValue: (value: ReturnType<typeof useSettings>) => void }) {
  onValue(useSettings());
  return null;
}

function CombinedProbe({
  onSettings,
  onSession,
}: {
  onSettings: (value: ReturnType<typeof useSettings>) => void;
  onSession: (value: ReturnType<typeof useStudySession>) => void;
}) {
  onSettings(useSettings());
  onSession(useStudySession());
  return null;
}

describe("SettingsContext orchestrator (RF-004, RF-005, RF-006, RF-007, RF-009, RF-011)", () => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(settingsStorage.loadSettings).mockResolvedValue(DEFAULT_POMODORO_SETTINGS);
    jest.mocked(settingsStorage.saveSettings).mockResolvedValue();
    jest.mocked(sessionStorage.loadStudySession).mockResolvedValue(null);
    jest.mocked(sessionStorage.saveStudySession).mockResolvedValue();
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: true,
      canAskAgain: true,
    });
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: true,
    });
    jest.mocked(notifications.scheduleFinishNotification).mockResolvedValue({
      available: true,
      notificationId: "notification-id-123",
    });
    jest.mocked(notifications.dismissAllNotifications).mockResolvedValue();
    jest.mocked(notifications.addNotificationResponseListener).mockReturnValue(() => {});
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
    jest.restoreAllMocks();
  });

  it("loads stored settings on mount and exposes them (RF-005, RF-011)", async () => {
    const customSettings: PomodoroSettings = {
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 20,
      cycleTarget: 4,
    };
    jest.mocked(settingsStorage.loadSettings).mockResolvedValueOnce(customSettings);

    let settingsValue!: ReturnType<typeof useSettings>;

    await act(async () => {
      renderer = TestRenderer.create(
        <SettingsProvider>
          <SettingsProbe onValue={(val) => (settingsValue = val)} />
        </SettingsProvider>,
      );
    });

    expect(settingsValue.loading).toBe(false);
    expect(settingsValue.settings).toEqual(customSettings);
  });

  it("saves new settings to storage and updates state (RF-004, RF-005)", async () => {
    let settingsValue!: ReturnType<typeof useSettings>;

    await act(async () => {
      renderer = TestRenderer.create(
        <SettingsProvider>
          <SettingsProbe onValue={(val) => (settingsValue = val)} />
        </SettingsProvider>,
      );
    });

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 45,
      shortBreakMinutes: 8,
      longBreakMinutes: 20,
      cycleTarget: 6,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    expect(settingsStorage.saveSettings).toHaveBeenCalledWith(newSettings);
    expect(settingsValue.settings).toEqual(newSettings);
  });

  it("updates nominal time immediately on main screen when session is stopped in reposo (RF-006)", async () => {
    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    expect(sessionValue.session.status).toBe("stopped");
    expect(sessionValue.session.remainingSeconds).toBe(25 * 60);

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 20,
      cycleTarget: 4,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    // En reposo: se actualiza de inmediato al nuevo tiempo guardado (50 min = 3000s)
    expect(sessionValue.session.remainingSeconds).toBe(50 * 60);
    expect(sessionValue.session.initialDurationSeconds).toBe(50 * 60);
    expect(sessionStorage.saveStudySession).toHaveBeenCalledWith(
      expect.objectContaining({
        remainingSeconds: 50 * 60,
        initialDurationSeconds: 50 * 60,
      }),
    );
  });

  it("preserves active countdown intact when saving settings during running session (RF-007)", async () => {
    const now = Date.now();
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, now - 10_000),
      status: "running",
      remainingSeconds: 842,
      endTimestamp: now + 842_000,
      lastActiveTimestamp: now - 10_000,
    };
    jest.mocked(sessionStorage.loadStudySession).mockResolvedValueOnce(runningSession);

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    expect(sessionValue.session.status).toBe("running");
    expect(sessionValue.session.remainingSeconds).toBe(842);

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 90,
      shortBreakMinutes: 15,
      longBreakMinutes: 30,
      cycleTarget: 4,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    // En curso: conserva el conteo activo intacto
    expect(sessionValue.session.remainingSeconds).toBe(842);
    expect(sessionValue.session.status).toBe("running");
  });

  it("resets settings to default (25/5/15/4) with resetToDefaults (RF-009)", async () => {
    const customSettings: PomodoroSettings = {
      studyDurationMinutes: 60,
      shortBreakMinutes: 12,
      longBreakMinutes: 25,
      cycleTarget: 8,
    };
    jest.mocked(settingsStorage.loadSettings).mockResolvedValueOnce(customSettings);

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await settingsValue.resetToDefaults();
    });

    expect(settingsStorage.saveSettings).toHaveBeenCalledWith(DEFAULT_POMODORO_SETTINGS);
    expect(settingsValue.settings).toEqual(DEFAULT_POMODORO_SETTINGS);
    expect(sessionValue.session.remainingSeconds).toBe(25 * 60);
  });

  it("retains settings in memory and exposes non-blocking warning when saveSettings fails (RF-007, Decisión 4)", async () => {
    jest.mocked(settingsStorage.saveSettings).mockRejectedValueOnce(new Error("Disk full error"));

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 40,
      shortBreakMinutes: 8,
      longBreakMinutes: 18,
      cycleTarget: 5,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    // Se mantienen en memoria y se aplican a la sesión de estudio
    expect(settingsValue.settings).toEqual(newSettings);
    expect(sessionValue.session.remainingSeconds).toBe(40 * 60);
    expect(settingsValue.warning).toContain("memoria");
  });

  it("retains defaults in memory and exposes warning when resetToDefaults fails (RF-007)", async () => {
    const customSettings: PomodoroSettings = {
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 20,
      cycleTarget: 4,
    };
    jest.mocked(settingsStorage.loadSettings).mockResolvedValueOnce(customSettings);
    jest.mocked(settingsStorage.saveSettings).mockRejectedValueOnce(new Error("Storage write failure"));

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await settingsValue.resetToDefaults();
    });

    expect(settingsValue.settings).toEqual(DEFAULT_POMODORO_SETTINGS);
    expect(sessionValue.session.remainingSeconds).toBe(25 * 60);
    expect(settingsValue.warning).toContain("memoria");
  });
});
