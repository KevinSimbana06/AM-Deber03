import type { AlarmNotificationContent, PomodoroPhase } from "../types/pomodoro";

export const ALARM_TIMEOUT_MS = 60_000;

export function getAlarmNotificationContent(
  finishedPhase: PomodoroPhase,
  nextPhase: PomodoroPhase,
  nextDurationMinutes: number,
): AlarmNotificationContent {
  if (finishedPhase === "study") {
    const breakType = nextPhase === "longBreak" ? "descanso largo" : "descanso corto";
    return {
      title: "¡Estudio terminado!",
      body: `Bien hecho. Listo para ${breakType} (${nextDurationMinutes} min)`,
    };
  }

  return {
    title: "¡Descanso terminado!",
    body: "Tiempo de concentrarse en la siguiente sesión de estudio",
  };
}

export function isAlarmExpired(
  startedTimestamp: number,
  currentTimestamp: number = Date.now(),
  timeoutMs: number = ALARM_TIMEOUT_MS,
): boolean {
  return currentTimestamp - startedTimestamp >= timeoutMs;
}
