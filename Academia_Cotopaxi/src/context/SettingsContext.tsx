import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PomodoroSettings } from "../types/pomodoro";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";
import { loadSettings, saveSettings as saveSettingsToStorage } from "../storage/settingsStorage";
import { StudySessionContext } from "./StudySessionContext";

export interface SettingsContextValue {
  settings: PomodoroSettings;
  loading: boolean;
  warning: string | null;
  saveSettings: (newSettings: PomodoroSettings) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  clearWarning: () => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_WARNING_MESSAGE =
  "No se pudieron guardar los ajustes en el dispositivo. Se conservarán en memoria mientras la aplicación esté abierta.";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_POMODORO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const studySession = useContext(StudySessionContext);

  useEffect(() => {
    let mounted = true;
    void loadSettings()
      .then((loaded) => {
        if (mounted) {
          setSettings(loaded);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setSettings(DEFAULT_POMODORO_SETTINGS);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const save = async (newSettings: PomodoroSettings) => {
    try {
      await saveSettingsToStorage(newSettings);
      setWarning(null);
    } catch {
      // Degradación suave: mantener en memoria activa (RF-007, Decisión 4)
      setWarning(STORAGE_WARNING_MESSAGE);
    }
    setSettings(newSettings);
    if (studySession) {
      await studySession.applySettings(newSettings);
    }
  };

  const resetToDefaults = async () => {
    try {
      await saveSettingsToStorage(DEFAULT_POMODORO_SETTINGS);
      setWarning(null);
    } catch {
      // Degradación suave: mantener en memoria activa (RF-007, Decisión 4)
      setWarning(STORAGE_WARNING_MESSAGE);
    }
    setSettings(DEFAULT_POMODORO_SETTINGS);
    if (studySession) {
      await studySession.applySettings(DEFAULT_POMODORO_SETTINGS);
    }
  };

  const clearWarning = () => setWarning(null);

  const value = useMemo(
    () => ({
      settings,
      loading,
      warning,
      saveSettings: save,
      resetToDefaults,
      clearWarning,
    }),
    [settings, loading, warning, studySession],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings debe usarse dentro de SettingsProvider.");
  }
  return context;
}
