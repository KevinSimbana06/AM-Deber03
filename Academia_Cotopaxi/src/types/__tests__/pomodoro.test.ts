import type {
  StudySession,
  RecoveryAnomaly,
  SessionRecoveryAnomaly,
  SessionRecoveryResult,
} from "../pomodoro";

describe("StudySession v3 and recovery types", () => {
  it("defines version 3 with notificationId and lastActiveTimestamp", () => {
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1200,
      endTimestamp: 1700000000000,
      completedPomodoros: 1,
      cycleTarget: 4,
      notificationId: "notif-123",
      lastActiveTimestamp: 1700000000000,
    };

    expect(session.version).toBe(3);
    expect(session.notificationId).toBe("notif-123");
    expect(session.lastActiveTimestamp).toBe(1700000000000);
  });

  it("allows notificationId to be null", () => {
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "stopped",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: null,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: 1700000000000,
    };

    expect(session.notificationId).toBeNull();
  });

  it("supports recovery anomalies and SessionRecoveryResult structure", () => {
    const anomalies: RecoveryAnomaly[] = [
      "none",
      "phaseCompletedInAbsence",
      "expiredInactivity",
      "clockBackward",
      "corruptData",
    ];

    expect(anomalies).toHaveLength(5);

    const baseSession: StudySession = {
      version: 3,
      phase: "study",
      status: "stopped",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: null,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: 1700000000000,
    };

    const recoveryResult: SessionRecoveryResult = {
      session: baseSession,
      anomaly: "expiredInactivity",
      message: "El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
      rescheduledNotification: false,
    };

    expect(recoveryResult.anomaly).toBe("expiredInactivity");
    expect(recoveryResult.session.version).toBe(3);
    expect(recoveryResult.message).toBeDefined();

    const aliasCheck: SessionRecoveryAnomaly = "clockBackward";
    expect(aliasCheck).toBe("clockBackward");
  });
});
