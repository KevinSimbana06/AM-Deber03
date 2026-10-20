export type DurationValidation =
  | { valid: true }
  | { valid: false; error: string };

export function validateStudyDuration(value: unknown): DurationValidation {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { valid: false, error: "La duración debe ser un número entero." };
  }

  if (!Number.isInteger(value) || value < 1 || value > 100) {
    return {
      valid: false,
      error: "La duración debe ser un número entero entre 1 y 100 minutos.",
    };
  }

  return { valid: true };
}
