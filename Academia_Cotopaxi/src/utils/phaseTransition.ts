import type { StudySession } from "../types/pomodoro";
import { getRemainingSeconds } from "./timer";

export interface PhaseDurations {
  studySeconds: number;
  shortBreakSeconds: number;
  longBreakSeconds: number;
}

function preparedSession(
  session: StudySession,
  phase: StudySession["phase"],
  durationSeconds: number,
  completedPomodoros: number,
): StudySession {
  return {
    ...session,
    phase,
    status: "stopped",
    initialDurationSeconds: durationSeconds,
    remainingSeconds: durationSeconds,
    endTimestamp: null,
    completedPomodoros,
  };
}

export function completePhase(
  session: StudySession,
  durations: PhaseDurations,
): StudySession {
  if (session.phase === "study") {
    const completedPomodoros = session.completedPomodoros + 1;
    if (completedPomodoros >= session.cycleTarget) {
      return preparedSession(session, "longBreak", durations.longBreakSeconds, 0);
    }
    return preparedSession(session, "shortBreak", durations.shortBreakSeconds, completedPomodoros);
  }

  return preparedSession(session, "study", durations.studySeconds, session.completedPomodoros);
}

export function getEffectiveSession(
  session: StudySession,
  currentTimestamp: number,
  durations?: PhaseDurations,
): StudySession {
  if (session.status !== "running" || session.endTimestamp === null) {
    return session;
  }

  const remainingSeconds = getRemainingSeconds(session.endTimestamp, currentTimestamp);
  if (remainingSeconds > 0) {
    return { ...session, remainingSeconds };
  }

  return durations
    ? completePhase({ ...session, remainingSeconds: 0 }, durations)
    : { ...session, status: "finished", remainingSeconds: 0, endTimestamp: null };
}
