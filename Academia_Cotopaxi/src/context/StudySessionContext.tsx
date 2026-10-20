import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import type { StudySession } from "../types/pomodoro";
import {
  cancelFinishNotification,
  requestNotificationPermission,
  scheduleFinishNotification,
} from "../services/notificationService";
import { loadStudySession, saveStudySession } from "../storage/sessionStorage";
import {
  pauseSession,
  resetSession,
  startSession,
} from "../utils/session";
import { createInitialSession } from "../utils/cycle";
import { getEffectiveSession as getPhaseEffectiveSession, type PhaseDurations } from "../utils/phaseTransition";

interface StudySessionContextValue {
  session: StudySession;
  loading: boolean;
  error: string | null;
  warning: string | null;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  reset: (confirmed: boolean) => Promise<void>;
}

const StudySessionContext = createContext<StudySessionContextValue | null>(null);
const DEFAULT_DURATION_SECONDS = 25 * 60;
const PHASE_DURATIONS: PhaseDurations = {
  studySeconds: 25 * 60,
  shortBreakSeconds: 5 * 60,
  longBreakSeconds: 15 * 60,
};

export function StudySessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState(() => createInitialSession(DEFAULT_DURATION_SECONDS, 300, 900, 4));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [notificationId, setNotificationId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void loadStudySession()
      .then(async (saved) => {
        if (mounted && saved) {
          const restored = getPhaseEffectiveSession(saved, Date.now(), PHASE_DURATIONS);
          setSession(restored);
          if (restored !== saved) {
            await saveStudySession(restored);
          }
        }
      })
      .catch(() => {
        if (mounted) {
          setError("No se pudo recuperar la sesión guardada.");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        setSession((current) => getPhaseEffectiveSession(current, Date.now(), PHASE_DURATIONS));
      }
    };
    const subscription = AppState.addEventListener("change", handleAppState);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (session.status !== "running" || session.endTimestamp === null) {
      return;
    }
    const interval = setInterval(() => {
      setSession((current) => getPhaseEffectiveSession(current, Date.now(), PHASE_DURATIONS));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.status, session.endTimestamp]);

  const commit = async (next: StudySession): Promise<boolean> => {
    try {
      await saveStudySession(next);
      setSession(next);
      setError(null);
      return true;
    } catch {
      setError("No se pudo guardar la sesión. Se conserva el último estado confirmado.");
      return false;
    }
  };

  const start = async () => {
    const next = startSession(getPhaseEffectiveSession(session, Date.now(), PHASE_DURATIONS), Date.now());
    if (next === session || !(await commit(next))) {
      return;
    }
    const permission = await requestNotificationPermission();
    if (!permission.available) {
      setWarning(permission.warning);
      return;
    }
    const scheduled = await scheduleFinishNotification(next.endTimestamp ?? Date.now(), next.phase);
    if (scheduled.available) {
      setNotificationId(scheduled.notificationId ?? null);
    } else {
      setWarning(scheduled.warning);
    }
  };

  const pause = async () => {
    const next = pauseSession(session, Date.now());
    if (next === session || !(await commit(next))) {
      return;
    }
    const result = await cancelFinishNotification(notificationId);
    if (!result.available) {
      setWarning(result.warning);
    }
    setNotificationId(null);
  };

  const reset = async (confirmed: boolean) => {
    if (!confirmed) {
      return;
    }
    const next = resetSession(session, true);
    if (await commit(next)) {
      const result = await cancelFinishNotification(notificationId);
      if (!result.available) {
        setWarning(result.warning);
      }
      setNotificationId(null);
    }
  };

  const value = useMemo(
    () => ({ session, loading, error, warning, start, pause, reset }),
    [session, loading, error, warning, notificationId],
  );

  return <StudySessionContext.Provider value={value}>{children}</StudySessionContext.Provider>;
}

export function useStudySession(): StudySessionContextValue {
  const value = useContext(StudySessionContext);
  if (value === null) {
    throw new Error("useStudySession debe usarse dentro de StudySessionProvider.");
  }
  return value;
}
