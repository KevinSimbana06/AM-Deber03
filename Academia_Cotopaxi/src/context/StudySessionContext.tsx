import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import type { PomodoroPhase, StudySession } from "../types/pomodoro";
import {
  addNotificationResponseListener,
  cancelFinishNotification,
  dismissAllNotifications,
  getNotificationPermissionStatus,
  openNotificationSettings,
  requestNotificationPermission,
  scheduleFinishNotification,
  startAlarmVibration,
  stopAlarmVibration,
} from "../services/notificationService";
import { loadStudySession, saveStudySession, StorageError } from "../storage/sessionStorage";
import {
  pauseSession,
  resetSession,
  startSession,
} from "../utils/session";
import { createInitialSession } from "../utils/cycle";
import { completePhase, type PhaseDurations } from "../utils/phaseTransition";
import { evaluateSessionRecovery } from "../utils/sessionRecovery";
import { getRemainingSeconds } from "../utils/timer";
import { ALARM_TIMEOUT_MS } from "../utils/alarmMessages";

export interface StudySessionContextValue {
  session: StudySession;
  loading: boolean;
  error: string | null;
  warning: string | null;
  info: string | null;
  isAlarmActive: boolean;
  alarmPhase: PomodoroPhase | null;
  isPermissionModalVisible: boolean;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  reset: (confirmed: boolean) => Promise<void>;
  stopAlarm: () => void;
  confirmPermissionModal: () => Promise<void>;
  dismissPermissionModal: () => Promise<void>;
  openNotificationSettings: () => Promise<void>;
}

const StudySessionContext = createContext<StudySessionContextValue | null>(null);
const DEFAULT_DURATION_SECONDS = 25 * 60;
const PHASE_DURATIONS: PhaseDurations = {
  studySeconds: 25 * 60,
  shortBreakSeconds: 5 * 60,
  longBreakSeconds: 15 * 60,
};

export function StudySessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StudySession>(() =>
    createInitialSession(DEFAULT_DURATION_SECONDS, 300, 900, 4, Date.now()),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [alarmPhase, setAlarmPhase] = useState<PomodoroPhase | null>(null);
  const [alarmStartedTimestamp, setAlarmStartedTimestamp] = useState<number | null>(null);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [hasDismissedPermissionModal, setHasDismissedPermissionModal] = useState(false);

  const stopAlarm = () => {
    setIsAlarmActive(false);
    setAlarmPhase(null);
    setAlarmStartedTimestamp(null);
    stopAlarmVibration();
    void dismissAllNotifications();
  };

  useEffect(() => {
    const unsubscribe = addNotificationResponseListener((_action) => {
      stopAlarm();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAlarmActive || alarmStartedTimestamp === null) {
      return;
    }
    const timeout = setTimeout(() => {
      stopAlarm();
    }, ALARM_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [isAlarmActive, alarmStartedTimestamp]);

  const synchronize = async (baseSession: StudySession): Promise<StudySession> => {
    void dismissAllNotifications();
    const recovery = evaluateSessionRecovery(baseSession, Date.now(), PHASE_DURATIONS);
    let nextSession = recovery.session;

    if (recovery.anomaly === "expiredInactivity") {
      setInfo(recovery.message ?? null);
    } else if (recovery.anomaly === "phaseCompletedInAbsence") {
      setInfo(recovery.message ?? null);
    } else if (recovery.anomaly === "clockBackward") {
      setWarning(recovery.message ?? null);
    }

    if (
      recovery.rescheduledNotification &&
      nextSession.status === "running" &&
      nextSession.endTimestamp !== null
    ) {
      const permission = await requestNotificationPermission();
      if (!permission.available) {
        setWarning(permission.warning);
      } else {
        const scheduled = await scheduleFinishNotification(
          nextSession.endTimestamp,
          nextSession.phase,
        );
        if (scheduled.available) {
          nextSession = {
            ...nextSession,
            notificationId: scheduled.notificationId ?? null,
          };
        } else {
          setWarning(scheduled.warning);
        }
      }
    }

    return nextSession;
  };

  useEffect(() => {
    let mounted = true;
    void dismissAllNotifications();

    void loadStudySession()
      .then(async (saved) => {
        if (!mounted) return;
        if (saved) {
          const nextSession = await synchronize(saved);
          setSession(nextSession);
          await saveStudySession(nextSession);
        }
      })
      .catch(async (err: unknown) => {
        if (!mounted) return;
        const isInvalid =
          (err instanceof StorageError && err.operation === "invalid") ||
          (typeof err === "object" && err !== null && (err as { operation?: string }).operation === "invalid");

        if (isInvalid) {
          setError(
            "No se pudo recuperar la sesión anterior: los datos guardados no eran válidos. Se inició una nueva sesión.",
          );
          const clean = createInitialSession(DEFAULT_DURATION_SECONDS, 300, 900, 4, Date.now());
          setSession(clean);
          try {
            await saveStudySession(clean);
          } catch {}
        } else {
          setError("No se pudo recuperar la sesión guardada.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        void dismissAllNotifications();
        setSession((current) => {
          const recovery = evaluateSessionRecovery(current, Date.now(), PHASE_DURATIONS);
          if (recovery.anomaly === "expiredInactivity") {
            setInfo(recovery.message ?? null);
          } else if (recovery.anomaly === "phaseCompletedInAbsence") {
            setInfo(recovery.message ?? null);
          } else if (recovery.anomaly === "clockBackward") {
            setWarning(recovery.message ?? null);
          }
          if (recovery.session !== current) {
            void saveStudySession(recovery.session);
          }
          return recovery.session;
        });
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
      setSession((current) => {
        if (current.status !== "running" || current.endTimestamp === null) return current;
        const remaining = getRemainingSeconds(current.endTimestamp, Date.now());
        if (remaining === 0) {
          const completed = completePhase({ ...current, remainingSeconds: 0 }, PHASE_DURATIONS);
          const next = {
            ...completed,
            notificationId: null,
            lastActiveTimestamp: Date.now(),
          };
          setIsAlarmActive(true);
          setAlarmPhase(current.phase);
          setAlarmStartedTimestamp(Date.now());
          startAlarmVibration();
          void saveStudySession(next);
          return next;
        }
        return {
          ...current,
          remainingSeconds: remaining,
          lastActiveTimestamp: Date.now(),
        };
      });
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

  const executeStart = async (allowNotification: boolean) => {
    stopAlarm();
    const syncCurrent = evaluateSessionRecovery(session, Date.now(), PHASE_DURATIONS).session;
    const next = startSession(syncCurrent, Date.now());
    if (next === session) {
      return;
    }

    next.lastActiveTimestamp = Date.now();

    let scheduledId: string | null = null;
    if (allowNotification) {
      const scheduled = await scheduleFinishNotification(
        next.endTimestamp ?? Date.now(),
        next.phase,
      );
      if (scheduled.available && scheduled.notificationId) {
        scheduledId = scheduled.notificationId;
      } else if (!scheduled.available) {
        setWarning(scheduled.warning);
      }
    }

    next.notificationId = scheduledId;
    await commit(next);
  };

  const start = async () => {
    stopAlarm();
    if (session.status === "running") {
      return;
    }

    const permissionStatus = await getNotificationPermissionStatus();
    if (!permissionStatus.granted && !hasDismissedPermissionModal && permissionStatus.canAskAgain) {
      setIsPermissionModalVisible(true);
      return;
    }

    if (!permissionStatus.granted) {
      setWarning("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.");
      await executeStart(false);
    } else {
      await executeStart(true);
    }
  };

  const confirmPermissionModal = async () => {
    setIsPermissionModalVisible(false);
    setHasDismissedPermissionModal(true);
    const permission = await requestNotificationPermission();
    if (permission.available) {
      setWarning(null);
      await executeStart(true);
    } else {
      setWarning("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.");
      await executeStart(false);
    }
  };

  const dismissPermissionModal = async () => {
    setIsPermissionModalVisible(false);
    setHasDismissedPermissionModal(true);
    setWarning("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.");
    await executeStart(false);
  };

  const handleOpenNotificationSettings = async () => {
    await openNotificationSettings();
  };

  const pause = async () => {
    stopAlarm();
    if (session.status !== "running") {
      return;
    }
    const idToCancel = session.notificationId;
    const next = pauseSession(session, Date.now());
    next.notificationId = null;
    next.lastActiveTimestamp = Date.now();
    if (!(await commit(next))) {
      return;
    }

    if (idToCancel !== null) {
      const result = await cancelFinishNotification(idToCancel);
      if (!result.available) {
        setWarning(result.warning);
      }
    }
  };

  const reset = async (confirmed: boolean) => {
    if (!confirmed) {
      return;
    }
    stopAlarm();
    const idToCancel = session.notificationId;
    const next = resetSession(session, true);
    next.notificationId = null;
    next.lastActiveTimestamp = Date.now();
    if (await commit(next)) {
      if (idToCancel !== null) {
        const result = await cancelFinishNotification(idToCancel);
        if (!result.available) {
          setWarning(result.warning);
        }
      }
    }
  };

  const value = useMemo(
    () => ({
      session,
      loading,
      error,
      warning,
      info,
      isAlarmActive,
      alarmPhase,
      isPermissionModalVisible,
      start,
      pause,
      reset,
      stopAlarm,
      confirmPermissionModal,
      dismissPermissionModal,
      openNotificationSettings: handleOpenNotificationSettings,
    }),
    [
      session,
      loading,
      error,
      warning,
      info,
      isAlarmActive,
      alarmPhase,
      isPermissionModalVisible,
      start,
      pause,
      reset,
      confirmPermissionModal,
      dismissPermissionModal,
      handleOpenNotificationSettings,
    ],
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
