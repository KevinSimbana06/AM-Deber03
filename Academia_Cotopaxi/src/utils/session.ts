import type { StudySession } from "../types/pomodoro";
import { getRemainingSeconds } from "./timer";
import { createInitialSession } from "./cycle";

export { createInitialSession } from "./cycle";

export function startSession(session: StudySession, currentTimestamp: number): StudySession {
  if (session.remainingSeconds <= 0 || session.status === "finished") {
    return session;
  }

  return {
    ...session,
    status: "running",
    endTimestamp: currentTimestamp + session.remainingSeconds * 1000,
  };
}

export function pauseSession(
  session: StudySession,
  currentTimestamp: number,
): StudySession {
  if (session.status !== "running" || session.endTimestamp === null) {
    return session;
  }

  return {
    ...session,
    status: "paused",
    remainingSeconds: getRemainingSeconds(session.endTimestamp, currentTimestamp),
    endTimestamp: null,
  };
}

export function getEffectiveSession(
  session: StudySession,
  currentTimestamp: number,
): StudySession {
  if (session.status !== "running" || session.endTimestamp === null) {
    return session;
  }

  const remainingSeconds = getRemainingSeconds(session.endTimestamp, currentTimestamp);
  if (remainingSeconds === 0) {
    return {
      ...session,
      status: "finished",
      remainingSeconds: 0,
      endTimestamp: null,
    };
  }

  return { ...session, remainingSeconds };
}

export function resetSession(session: StudySession, confirmed: boolean): StudySession {
  return confirmed
    ? createInitialSession(session.initialDurationSeconds, 300, 900, session.cycleTarget)
    : session;
}
