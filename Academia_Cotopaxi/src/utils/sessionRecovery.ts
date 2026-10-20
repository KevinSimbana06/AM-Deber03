import type { StudySession, SessionRecoveryResult } from "../types/pomodoro";
import type { PhaseDurations } from "./phaseTransition";
import { completePhase } from "./phaseTransition";
import { createInitialSession } from "./cycle";

export const INACTIVITY_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 horas

export function evaluateSessionRecovery(
  session: StudySession,
  currentTimestamp: number,
  durations: PhaseDurations,
): SessionRecoveryResult {
  // 1. Evaluación de inactividad prolongada (> 24 h) para sesiones en curso o pausadas
  if (session.status === "running" && session.endTimestamp !== null) {
    if (currentTimestamp - session.endTimestamp > INACTIVITY_THRESHOLD_MS) {
      return {
        session: createInitialSession(
          durations.studySeconds,
          durations.shortBreakSeconds,
          durations.longBreakSeconds,
          session.cycleTarget,
          currentTimestamp,
        ),
        anomaly: "expiredInactivity",
        message:
          "El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
        rescheduledNotification: false,
      };
    }
  }

  if (session.status === "paused") {
    if (currentTimestamp - session.lastActiveTimestamp > INACTIVITY_THRESHOLD_MS) {
      return {
        session: createInitialSession(
          durations.studySeconds,
          durations.shortBreakSeconds,
          durations.longBreakSeconds,
          session.cycleTarget,
          currentTimestamp,
        ),
        anomaly: "expiredInactivity",
        message:
          "La sesión pausada expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
        rescheduledNotification: false,
      };
    }
  }

  // 2. Evaluación de sesión en curso
  if (session.status === "running" && session.endTimestamp !== null) {
    const rawRemaining = Math.max(0, Math.ceil((session.endTimestamp - currentTimestamp) / 1000));

    // 2a. Reloj modificado hacia atrás: tiempo restante supera la duración nominal de la fase
    if (rawRemaining > session.initialDurationSeconds) {
      const boundedSeconds = session.initialDurationSeconds;
      return {
        session: {
          ...session,
          remainingSeconds: boundedSeconds,
          endTimestamp: currentTimestamp + boundedSeconds * 1000,
          lastActiveTimestamp: currentTimestamp,
        },
        anomaly: "clockBackward",
        message:
          "Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.",
        rescheduledNotification: true,
      };
    }

    // 2b. Fase finalizada en ausencia
    if (rawRemaining === 0) {
      const nextPhase = completePhase(
        {
          ...session,
          remainingSeconds: 0,
        },
        durations,
      );
      return {
        session: {
          ...nextPhase,
          notificationId: null,
          lastActiveTimestamp: currentTimestamp,
        },
        anomaly: "phaseCompletedInAbsence",
        message: "La fase anterior terminó mientras la aplicación no estaba activa.",
        rescheduledNotification: false,
      };
    }

    // 2c. Sesión en curso dentro de parámetros normales
    return {
      session: {
        ...session,
        remainingSeconds: rawRemaining,
        lastActiveTimestamp: currentTimestamp,
      },
      anomaly: "none",
      rescheduledNotification: true,
    };
  }

  // 3. Sesión pausada dentro de las 24 horas
  if (session.status === "paused") {
    return {
      session: {
        ...session,
        lastActiveTimestamp: currentTimestamp,
      },
      anomaly: "none",
      rescheduledNotification: false,
    };
  }

  // 4. Sesión detenida o finalizada
  return {
    session: {
      ...session,
      lastActiveTimestamp: currentTimestamp,
    },
    anomaly: "none",
    rescheduledNotification: false,
  };
}
