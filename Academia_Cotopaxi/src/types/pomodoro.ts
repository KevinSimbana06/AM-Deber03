export type SessionStatus = "stopped" | "running" | "paused" | "finished";
export type PomodoroPhase = "study" | "shortBreak" | "longBreak";

export interface StudySession {
  version: 3;
  phase: PomodoroPhase;
  status: SessionStatus;
  initialDurationSeconds: number;
  remainingSeconds: number;
  endTimestamp: number | null;
  completedPomodoros: number;
  cycleTarget: number;
  notificationId: string | null;
  lastActiveTimestamp: number;
}

export interface StudySettings {
  studyDurationMinutes: number;
}

export type RecoveryAnomaly =
  | "none"
  | "phaseCompletedInAbsence"
  | "expiredInactivity"
  | "clockBackward"
  | "corruptData";

export type SessionRecoveryAnomaly = RecoveryAnomaly;

export interface SessionRecoveryResult {
  session: StudySession;
  anomaly: RecoveryAnomaly;
  message?: string;
  rescheduledNotification?: boolean;
}

export interface AlarmNotificationContent {
  title: string;
  body: string;
}

export interface AlarmState {
  isActive: boolean;
  phase: PomodoroPhase | null;
  startedTimestamp: number | null;
}

