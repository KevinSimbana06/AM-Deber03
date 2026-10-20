import type { StudySession } from "../types/pomodoro";

export function createInitialSession(
  studyDurationSeconds: number,
  _shortBreakDurationSeconds = 300,
  _longBreakDurationSeconds = 900,
  cycleTarget = 4,
  lastActiveTimestamp = 0,
): StudySession {
  return {
    version: 3,
    phase: "study",
    status: "stopped",
    initialDurationSeconds: studyDurationSeconds,
    remainingSeconds: studyDurationSeconds,
    endTimestamp: null,
    completedPomodoros: 0,
    cycleTarget,
    notificationId: null,
    lastActiveTimestamp,
  };
}

