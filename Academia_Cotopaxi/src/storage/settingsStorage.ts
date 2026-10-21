import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PomodoroSettings } from "../types/pomodoro";
import { DEFAULT_POMODORO_SETTINGS, validateCycleSettings } from "../utils/cycleSettings";
import { StorageError } from "./sessionStorage";

export const SETTINGS_STORAGE_KEY = "@pomodoro_settings";

export async function loadSettings(): Promise<PomodoroSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw === null) {
      return DEFAULT_POMODORO_SETTINGS;
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return DEFAULT_POMODORO_SETTINGS;
    }

    const candidate = parsed as Partial<PomodoroSettings>;
    const validation = validateCycleSettings({
      studyDurationMinutes: candidate.studyDurationMinutes,
      shortBreakMinutes: candidate.shortBreakMinutes,
      longBreakMinutes: candidate.longBreakMinutes,
      cycleTarget: candidate.cycleTarget,
    });

    if (!validation.valid) {
      return DEFAULT_POMODORO_SETTINGS;
    }

    return {
      studyDurationMinutes: candidate.studyDurationMinutes as number,
      shortBreakMinutes: candidate.shortBreakMinutes as number,
      longBreakMinutes: candidate.longBreakMinutes as number,
      cycleTarget: candidate.cycleTarget as number,
    };
  } catch {
    // Tolerante y silencioso ante corrupciones o fallos de lectura (RF-011, Decisión 8)
    return DEFAULT_POMODORO_SETTINGS;
  }
}

export async function saveSettings(settings: PomodoroSettings): Promise<void> {
  const validation = validateCycleSettings(settings);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const sanitized: PomodoroSettings = {
    studyDurationMinutes: settings.studyDurationMinutes,
    shortBreakMinutes: settings.shortBreakMinutes,
    longBreakMinutes: settings.longBreakMinutes,
    cycleTarget: settings.cycleTarget,
  };

  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "No se pudieron guardar los ajustes.";
    throw new StorageError("write", message);
  }
}

