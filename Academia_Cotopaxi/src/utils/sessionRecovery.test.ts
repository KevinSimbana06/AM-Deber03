import { evaluateSessionRecovery } from "./sessionRecovery";
import type { StudySession } from "../types/pomodoro";
import type { PhaseDurations } from "./phaseTransition";

describe("evaluateSessionRecovery pure utility", () => {
  const durations: PhaseDurations = {
    studySeconds: 1500,
    shortBreakSeconds: 300,
    longBreakSeconds: 900,
  };

  const ONE_HOUR = 60 * 60 * 1000;
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  it("recovers a running session with valid remaining time without anomaly", () => {
    const current = 1_000_000;
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current + 500_000, // 500s remaining
      completedPomodoros: 1,
      cycleTarget: 4,
      notificationId: "notif-abc",
      lastActiveTimestamp: current - 10_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("none");
    expect(result.session.status).toBe("running");
    expect(result.session.remainingSeconds).toBe(500);
    expect(result.session.lastActiveTimestamp).toBe(current);
    expect(result.rescheduledNotification).toBe(true);
  });

  it("detects clock moved backwards beyond initial duration and caps remaining time (RF-007)", () => {
    const current = 1_000_000;
    // Suppose initialDuration is 1500s. Clock shifted back so endTimestamp - current = 2500s
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1000,
      endTimestamp: current + 2_500_000,
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: "notif-abc",
      lastActiveTimestamp: current - 5_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("clockBackward");
    expect(result.session.remainingSeconds).toBe(1500);
    expect(result.session.endTimestamp).toBe(current + 1500 * 1000);
    expect(result.message).toBe(
      "Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.",
    );
    expect(result.rescheduledNotification).toBe(true);
  });

  it("handles phase completed in absence when under 24 hours (RF-004)", () => {
    const current = 1_000_000;
    // Ended 10 minutes ago
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current - 600_000,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: "notif-1",
      lastActiveTimestamp: current - 2_100_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("phaseCompletedInAbsence");
    expect(result.session.phase).toBe("shortBreak");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(1);
    expect(result.session.remainingSeconds).toBe(300);
    expect(result.session.endTimestamp).toBeNull();
    expect(result.session.notificationId).toBeNull();
    expect(result.session.lastActiveTimestamp).toBe(current);
    expect(result.message).toBe("La fase anterior terminó mientras la aplicación no estaba activa.");
  });

  it("advances to longBreak on 4th pomodoro completed in absence (RF-004)", () => {
    const current = 1_000_000;
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current - 60_000,
      completedPomodoros: 3,
      cycleTarget: 4,
      notificationId: "notif-1",
      lastActiveTimestamp: current - 1_560_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("phaseCompletedInAbsence");
    expect(result.session.phase).toBe("longBreak");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(0); // Cycle completed, resets to 0
    expect(result.session.remainingSeconds).toBe(900);
    expect(result.message).toBe("La fase anterior terminó mientras la aplicación no estaba activa.");
  });

  it("expires cycle after > 24 hours of inactivity on a finished phase (RF-008)", () => {
    const current = 100_000_000;
    // Ended 25 hours ago
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current - (TWENTY_FOUR_HOURS + ONE_HOUR),
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: "notif-old",
      lastActiveTimestamp: current - (TWENTY_FOUR_HOURS + 2 * ONE_HOUR),
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("expiredInactivity");
    expect(result.session.phase).toBe("study");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(0);
    expect(result.session.remainingSeconds).toBe(durations.studySeconds);
    expect(result.session.notificationId).toBeNull();
    expect(result.session.endTimestamp).toBeNull();
    expect(result.message).toBe(
      "El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
    );
  });

  it("expires cycle after > 24 hours of inactivity on a paused session (RF-009)", () => {
    const current = 100_000_000;
    // Paused 26 hours ago
    const session: StudySession = {
      version: 3,
      phase: "shortBreak",
      status: "paused",
      initialDurationSeconds: 300,
      remainingSeconds: 150,
      endTimestamp: null,
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: current - (TWENTY_FOUR_HOURS + 2 * ONE_HOUR),
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("expiredInactivity");
    expect(result.session.phase).toBe("study");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(0);
    expect(result.session.remainingSeconds).toBe(durations.studySeconds);
    expect(result.message).toBe(
      "La sesión pausada expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
    );
  });

  it("keeps paused session intact when paused for less than 24 hours (RF-005)", () => {
    const current = 100_000_000;
    // Paused 5 hours ago
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "paused",
      initialDurationSeconds: 1500,
      remainingSeconds: 750,
      endTimestamp: null,
      completedPomodoros: 1,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: current - 5 * ONE_HOUR,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("none");
    expect(result.session.status).toBe("paused");
    expect(result.session.remainingSeconds).toBe(750);
    expect(result.session.completedPomodoros).toBe(1);
    expect(result.session.phase).toBe("study");
    expect(result.session.lastActiveTimestamp).toBe(current);
  });

  it("handles stopped session without anomaly", () => {
    const current = 100_000_000;
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
      lastActiveTimestamp: current - 1000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("none");
    expect(result.session.status).toBe("stopped");
    expect(result.session.remainingSeconds).toBe(1500);
  });
});
