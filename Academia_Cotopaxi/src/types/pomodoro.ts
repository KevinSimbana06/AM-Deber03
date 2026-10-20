export type SessionStatus = "stopped" | "running" | "paused" | "finished";
export type PomodoroPhase = "study" | "shortBreak" | "longBreak";

export interface StudySession {
  version: 2;
  phase: PomodoroPhase;
  status: SessionStatus;
  initialDurationSeconds: number;
  remainingSeconds: number;
  endTimestamp: number | null;
  completedPomodoros: number;
  cycleTarget: number;
}

export interface StudySettings {
  studyDurationMinutes: number;
}
