export interface CycleSettingsInput {
  studyMinutes: unknown;
  shortBreakMinutes: unknown;
  longBreakMinutes: unknown;
  cycleTarget: unknown;
}

export type CycleSettingsValidation =
  | { valid: true }
  | { valid: false; error: string };

export function validateCycleSettings(
  settings: CycleSettingsInput,
): CycleSettingsValidation {
  const durations = [
    { value: settings.studyMinutes, min: 1, max: 100, label: "estudio" },
    { value: settings.shortBreakMinutes, min: 1, max: 100, label: "descanso corto" },
    { value: settings.longBreakMinutes, min: 1, max: 15, label: "descanso largo" },
  ];

  for (const duration of durations) {
    if (
      typeof duration.value !== "number" ||
      !Number.isInteger(duration.value) ||
      duration.value < duration.min ||
      duration.value > duration.max
    ) {
      return {
        valid: false,
        error: `La duración de ${duration.label} debe ser un entero válido.`,
      };
    }
  }

  if (
    typeof settings.cycleTarget !== "number" ||
    !Number.isInteger(settings.cycleTarget) ||
    settings.cycleTarget < 1 ||
    settings.cycleTarget > 4
  ) {
    return {
      valid: false,
      error: "El objetivo debe ser un número entero entre 1 y 4.",
    };
  }

  return { valid: true };
}
