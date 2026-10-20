import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PomodoroPhase, SessionStatus, StudySession } from "../types/pomodoro";

const SESSION_KEY = "pomodoro.activeSession";
const STORAGE_VERSION = 3;

export class StorageError extends Error {
  constructor(
    public readonly operation: "read" | "write" | "invalid",
    message: string,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

interface StoredSession {
  version: 3;
  session: StudySession;
}

function isValidSession(session: unknown): session is StudySession {
  if (typeof session !== "object" || session === null) return false;
  const value = session as Partial<StudySession>;
  const completedPomodoros = value.completedPomodoros;
  const cycleTarget = value.cycleTarget;
  return (
    value.version === 3 &&
    ["study", "shortBreak", "longBreak"].includes(value.phase ?? "") &&
    ["stopped", "running", "paused", "finished"].includes(value.status ?? "") &&
    typeof value.initialDurationSeconds === "number" &&
    value.initialDurationSeconds > 0 &&
    typeof value.remainingSeconds === "number" &&
    value.remainingSeconds >= 0 &&
    (typeof value.endTimestamp === "number" || value.endTimestamp === null) &&
    typeof completedPomodoros === "number" &&
    typeof cycleTarget === "number" &&
    Number.isInteger(completedPomodoros) &&
    Number.isInteger(cycleTarget) &&
    completedPomodoros >= 0 &&
    cycleTarget >= 1 &&
    completedPomodoros < cycleTarget &&
    (value.notificationId === null || typeof value.notificationId === "string") &&
    typeof value.lastActiveTimestamp === "number" &&
    Number.isInteger(value.lastActiveTimestamp) &&
    value.lastActiveTimestamp >= 0
  );
}

export async function loadStudySession(): Promise<StudySession | null> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(SESSION_KEY);
  } catch {
    throw new StorageError("read", "No se pudo recuperar la sesión guardada.");
  }

  if (raw === null) {
    return null;
  }

  let stored: { version?: number; session?: Partial<StudySession> };
  try {
    stored = JSON.parse(raw);
  } catch {
    throw new StorageError("invalid", "No se pudo recuperar la sesión: los datos no son válidos.");
  }

  if (typeof stored !== "object" || stored === null) {
    throw new StorageError("invalid", "No se pudo recuperar la sesión: los datos no son válidos.");
  }

  const storedVersion = stored.version;

  // Migración versión 1 -> versión 3
  if (storedVersion === 1 && stored.session) {
    const legacy = stored.session;
    if (
      legacy.phase === "study" &&
      typeof legacy.initialDurationSeconds === "number" &&
      typeof legacy.remainingSeconds === "number"
    ) {
      return {
        version: 3,
        phase: "study",
        status: legacy.status ?? "stopped",
        initialDurationSeconds: legacy.initialDurationSeconds,
        remainingSeconds: legacy.remainingSeconds,
        endTimestamp: legacy.endTimestamp ?? null,
        completedPomodoros: 0,
        cycleTarget: 4,
        notificationId: null,
        lastActiveTimestamp: Date.now(),
      };
    }
  }

  // Migración versión 2 -> versión 3
  if (storedVersion === 2 && stored.session) {
    const legacy = stored.session;
    if (
      ["study", "shortBreak", "longBreak"].includes(legacy.phase ?? "") &&
      ["stopped", "running", "paused", "finished"].includes(legacy.status ?? "") &&
      typeof legacy.initialDurationSeconds === "number" &&
      typeof legacy.remainingSeconds === "number" &&
      typeof legacy.completedPomodoros === "number" &&
      typeof legacy.cycleTarget === "number"
    ) {
      return {
        version: 3,
        phase: legacy.phase as PomodoroPhase,
        status: legacy.status as SessionStatus,
        initialDurationSeconds: legacy.initialDurationSeconds,
        remainingSeconds: legacy.remainingSeconds,
        endTimestamp: legacy.endTimestamp ?? null,
        completedPomodoros: legacy.completedPomodoros,
        cycleTarget: legacy.cycleTarget,
        notificationId: null,
        lastActiveTimestamp: Date.now(),
      };
    }
  }

  // Versión 3
  if (storedVersion === STORAGE_VERSION && isValidSession(stored.session)) {
    return stored.session;
  }

  throw new StorageError("invalid", "No se pudo recuperar la sesión: los datos no son válidos.");
}

export async function saveStudySession(session: StudySession): Promise<void> {
  try {
    const stored: StoredSession = { version: STORAGE_VERSION, session };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  } catch {
    throw new StorageError("write", "No se pudo guardar la sesión.");
  }
}
