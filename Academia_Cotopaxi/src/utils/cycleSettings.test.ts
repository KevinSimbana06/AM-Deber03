import {
  DEFAULT_POMODORO_SETTINGS,
  SETTINGS_LIMITS,
  validateCycleSettings,
  validateCycleTarget,
  validateLongBreak,
  validateShortBreak,
  validateStudyDuration,
} from "./cycleSettings";

describe("cycleSettings pure validations (RF-002, RF-003)", () => {
  describe("default and limit constants", () => {
    it("provides 25/5/15/4 as default settings", () => {
      expect(DEFAULT_POMODORO_SETTINGS).toEqual({
        studyDurationMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      });
    });

    it("defines correct educational limits", () => {
      expect(SETTINGS_LIMITS.study).toEqual({ min: 25, max: 90 });
      expect(SETTINGS_LIMITS.shortBreak).toEqual({ min: 5, max: 20 });
      expect(SETTINGS_LIMITS.longBreak).toEqual({ min: 15, max: 30 });
      expect(SETTINGS_LIMITS.cycle).toEqual({ min: 2, max: 8 });
    });
  });

  describe("validateStudyDuration", () => {
    it("accepts valid values within [25, 90]", () => {
      expect(validateStudyDuration(25)).toEqual({ valid: true });
      expect(validateStudyDuration(50)).toEqual({ valid: true });
      expect(validateStudyDuration(90)).toEqual({ valid: true });
      expect(validateStudyDuration("45")).toEqual({ valid: true });
    });

    it("rejects values outside [25, 90]", () => {
      expect(validateStudyDuration(24)).toEqual({
        valid: false,
        error: expect.stringContaining("25 y 90"),
      });
      expect(validateStudyDuration(91)).toEqual({
        valid: false,
        error: expect.stringContaining("25 y 90"),
      });
    });

    it("rejects decimals, negatives, empty and non-numeric values", () => {
      expect(validateStudyDuration(25.5).valid).toBe(false);
      expect(validateStudyDuration(-25).valid).toBe(false);
      expect(validateStudyDuration(0).valid).toBe(false);
      expect(validateStudyDuration("").valid).toBe(false);
      expect(validateStudyDuration("abc").valid).toBe(false);
      expect(validateStudyDuration(null).valid).toBe(false);
      expect(validateStudyDuration(undefined).valid).toBe(false);
    });
  });

  describe("validateShortBreak", () => {
    it("accepts valid values within [5, 20]", () => {
      expect(validateShortBreak(5)).toEqual({ valid: true });
      expect(validateShortBreak(10)).toEqual({ valid: true });
      expect(validateShortBreak(20)).toEqual({ valid: true });
      expect(validateShortBreak("15")).toEqual({ valid: true });
    });

    it("rejects values outside [5, 20]", () => {
      expect(validateShortBreak(4)).toEqual({
        valid: false,
        error: expect.stringContaining("5 y 20"),
      });
      expect(validateShortBreak(21)).toEqual({
        valid: false,
        error: expect.stringContaining("5 y 20"),
      });
    });

    it("rejects decimals, negatives and non-numbers", () => {
      expect(validateShortBreak(5.5).valid).toBe(false);
      expect(validateShortBreak(-5).valid).toBe(false);
      expect(validateShortBreak("").valid).toBe(false);
      expect(validateShortBreak("xyz").valid).toBe(false);
    });
  });

  describe("validateLongBreak", () => {
    it("accepts valid values within [15, 30]", () => {
      expect(validateLongBreak(15)).toEqual({ valid: true });
      expect(validateLongBreak(20)).toEqual({ valid: true });
      expect(validateLongBreak(30)).toEqual({ valid: true });
      expect(validateLongBreak("25")).toEqual({ valid: true });
    });

    it("rejects values outside [15, 30]", () => {
      expect(validateLongBreak(14)).toEqual({
        valid: false,
        error: expect.stringContaining("15 y 30"),
      });
      expect(validateLongBreak(31)).toEqual({
        valid: false,
        error: expect.stringContaining("15 y 30"),
      });
    });

    it("rejects decimals, negatives and invalid formats", () => {
      expect(validateLongBreak(15.2).valid).toBe(false);
      expect(validateLongBreak(-15).valid).toBe(false);
      expect(validateLongBreak("").valid).toBe(false);
    });
  });

  describe("validateCycleTarget", () => {
    it("accepts valid values within [2, 8]", () => {
      expect(validateCycleTarget(2)).toEqual({ valid: true });
      expect(validateCycleTarget(4)).toEqual({ valid: true });
      expect(validateCycleTarget(8)).toEqual({ valid: true });
      expect(validateCycleTarget("6")).toEqual({ valid: true });
    });

    it("rejects values outside [2, 8]", () => {
      expect(validateCycleTarget(1)).toEqual({
        valid: false,
        error: expect.stringContaining("2 y 8"),
      });
      expect(validateCycleTarget(9)).toEqual({
        valid: false,
        error: expect.stringContaining("2 y 8"),
      });
    });

    it("rejects non-integers, empty and negative values", () => {
      expect(validateCycleTarget(4.5).valid).toBe(false);
      expect(validateCycleTarget(-2).valid).toBe(false);
      expect(validateCycleTarget("").valid).toBe(false);
    });
  });

  describe("validateCycleSettings (composite object)", () => {
    it("accepts valid composite settings with PomodoroSettings interface", () => {
      expect(
        validateCycleSettings({
          studyDurationMinutes: 25,
          shortBreakMinutes: 5,
          longBreakMinutes: 15,
          cycleTarget: 4,
        }),
      ).toEqual({ valid: true });
    });

    it("accepts valid composite settings with legacy property names", () => {
      expect(
        validateCycleSettings({
          studyMinutes: 30,
          shortBreakMinutes: 10,
          longBreakMinutes: 20,
          cycleTarget: 4,
        }),
      ).toEqual({ valid: true });
    });

    it("rejects composite settings with any invalid field", () => {
      expect(
        validateCycleSettings({
          studyDurationMinutes: 20, // Invalid (<25)
          shortBreakMinutes: 5,
          longBreakMinutes: 15,
          cycleTarget: 4,
        }),
      ).toEqual({
        valid: false,
        error: expect.stringContaining("25 y 90"),
      });

      expect(
        validateCycleSettings({
          studyDurationMinutes: 25,
          shortBreakMinutes: 25, // Invalid (>20)
          longBreakMinutes: 15,
          cycleTarget: 4,
        }),
      ).toEqual({
        valid: false,
        error: expect.stringContaining("5 y 20"),
      });
    });
  });
});
