import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StudySession } from "../types/pomodoro";

const SESSION_KEY = "pomodoro.activeSession";
const STORAGE_VERSION = 2;

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
  version: 2;
  session: StudySession;
}

function isValidSession(session: unknown): session is StudySession {
  if (typeof session !== "object" || session === null) return false;
  const value = session as Partial<StudySession>;
  const completedPomodoros = value.completedPomodoros;
  const cycleTarget = value.cycleTarget;
  return (
    value.version === 2 &&
    ["study", "shortBreak", "longBreak"].includes(value.phase ?? "") &&
    ["stopped", "running", "paused", "finished"].includes(value.status ?? "") &&
    typeof value.initialDurationSeconds === "number" &&
    typeof value.remainingSeconds === "number" &&
    (typeof value.endTimestamp === "number" || value.endTimestamp === null) &&
    typeof completedPomodoros === "number" &&
    typeof cycleTarget === "number" &&
    Number.isInteger(completedPomodoros) &&
    Number.isInteger(cycleTarget) &&
    completedPomodoros >= 0 &&
    cycleTarget >= 1 &&
    completedPomodoros < cycleTarget
  );
}

export async function loadStudySession(): Promise<StudySession | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (raw === null) {
      return null;
    }

    const stored = JSON.parse(raw) as Partial<StoredSession> & {
      version?: number;
      session?: Partial<StudySession>;
    };
    const storedVersion = (stored as { version?: number }).version;
    if (storedVersion === 1 && stored.session) {
      const legacy = stored.session;
      if (
        legacy.phase === "study" &&
        typeof legacy.initialDurationSeconds === "number" &&
        typeof legacy.remainingSeconds === "number"
      ) {
        return {
          version: 2,
          phase: "study",
          status: "stopped",
          initialDurationSeconds: legacy.initialDurationSeconds,
          remainingSeconds: legacy.remainingSeconds,
          endTimestamp: null,
          completedPomodoros: 0,
          cycleTarget: 4,
        };
      }
    }
    if (storedVersion !== STORAGE_VERSION || !isValidSession(stored.session)) {
      throw new StorageError("invalid", "No se pudo recuperar la sesión: los datos no son válidos.");
    }
    return stored.session;
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError("read", "No se pudo recuperar la sesión guardada.");
  }
}

export async function saveStudySession(session: StudySession): Promise<void> {
  try {
    const stored: StoredSession = { version: STORAGE_VERSION, session };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  } catch {
    throw new StorageError("write", "No se pudo guardar la sesión.");
  }
}
