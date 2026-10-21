import type { PomodoroSettings } from "../types/pomodoro";

export const SETTINGS_LIMITS = {
  study: { min: 25, max: 90 },
  shortBreak: { min: 5, max: 20 },
  longBreak: { min: 15, max: 30 },
  cycle: { min: 2, max: 8 },
} as const;

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  studyDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cycleTarget: 4,
};

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

function parseInteger(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      return null;
    }
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) {
      return null;
    }
    const parsed = parseInt(trimmed, 10);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }
  return null;
}

export function validateStudyDuration(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.study.min ||
    parsed > SETTINGS_LIMITS.study.max
  ) {
    return {
      valid: false,
      error: `El tiempo de estudio debe ser un número entero entre ${SETTINGS_LIMITS.study.min} y ${SETTINGS_LIMITS.study.max} minutos.`,
    };
  }
  return { valid: true };
}

export function validateShortBreak(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.shortBreak.min ||
    parsed > SETTINGS_LIMITS.shortBreak.max
  ) {
    return {
      valid: false,
      error: `El descanso corto debe ser un número entero entre ${SETTINGS_LIMITS.shortBreak.min} y ${SETTINGS_LIMITS.shortBreak.max} minutos.`,
    };
  }
  return { valid: true };
}

export function validateLongBreak(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.longBreak.min ||
    parsed > SETTINGS_LIMITS.longBreak.max
  ) {
    return {
      valid: false,
      error: `El descanso largo debe ser un número entero entre ${SETTINGS_LIMITS.longBreak.min} y ${SETTINGS_LIMITS.longBreak.max} minutos.`,
    };
  }
  return { valid: true };
}

export function validateCycleTarget(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.cycle.min ||
    parsed > SETTINGS_LIMITS.cycle.max
  ) {
    return {
      valid: false,
      error: `La cantidad de pomodoros por ciclo debe ser un número entero entre ${SETTINGS_LIMITS.cycle.min} y ${SETTINGS_LIMITS.cycle.max}.`,
    };
  }
  return { valid: true };
}

export interface CycleSettingsInput {
  studyMinutes?: unknown;
  studyDurationMinutes?: unknown;
  shortBreakMinutes?: unknown;
  longBreakMinutes?: unknown;
  cycleTarget?: unknown;
}

export function validateCycleSettings(settings: CycleSettingsInput): ValidationResult {
  const studyVal = settings.studyDurationMinutes ?? settings.studyMinutes;
  const studyCheck = validateStudyDuration(studyVal);
  if (!studyCheck.valid) {
    return studyCheck;
  }

  const shortCheck = validateShortBreak(settings.shortBreakMinutes);
  if (!shortCheck.valid) {
    return shortCheck;
  }

  const longCheck = validateLongBreak(settings.longBreakMinutes);
  if (!longCheck.valid) {
    return longCheck;
  }

  const cycleCheck = validateCycleTarget(settings.cycleTarget);
  if (!cycleCheck.valid) {
    return cycleCheck;
  }

  return { valid: true };
}

export function validateSettingsForm(input: {
  studyDurationMinutes?: string;
  shortBreakMinutes?: string;
  longBreakMinutes?: string;
  cycleTarget?: string;
}): {
  isValid: boolean;
  errors: {
    studyDurationMinutes?: string;
    shortBreakMinutes?: string;
    longBreakMinutes?: string;
    cycleTarget?: string;
  };
} {
  const errors: {
    studyDurationMinutes?: string;
    shortBreakMinutes?: string;
    longBreakMinutes?: string;
    cycleTarget?: string;
  } = {};

  const studyCheck = validateStudyDuration(input.studyDurationMinutes);
  if (!studyCheck.valid) {
    errors.studyDurationMinutes = studyCheck.error;
  }

  const shortCheck = validateShortBreak(input.shortBreakMinutes);
  if (!shortCheck.valid) {
    errors.shortBreakMinutes = shortCheck.error;
  }

  const longCheck = validateLongBreak(input.longBreakMinutes);
  if (!longCheck.valid) {
    errors.longBreakMinutes = longCheck.error;
  }

  const cycleCheck = validateCycleTarget(input.cycleTarget);
  if (!cycleCheck.valid) {
    errors.cycleTarget = cycleCheck.error;
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}

export function parseSettingsForm(input: {
  studyDurationMinutes: string;
  shortBreakMinutes: string;
  longBreakMinutes: string;
  cycleTarget: string;
}): PomodoroSettings | null {
  const validation = validateSettingsForm(input);
  if (!validation.isValid) {
    return null;
  }

  return {
    studyDurationMinutes: parseInt(input.studyDurationMinutes.trim(), 10),
    shortBreakMinutes: parseInt(input.shortBreakMinutes.trim(), 10),
    longBreakMinutes: parseInt(input.longBreakMinutes.trim(), 10),
    cycleTarget: parseInt(input.cycleTarget.trim(), 10),
  };
}

