import { validateCycleSettings } from "./cycleSettings";

describe("cycle settings validation", () => {
  it("accepts configured ranges", () => {
    expect(validateCycleSettings({
      studyMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      cycleTarget: 4,
    })).toEqual({ valid: true });
  });

  it.each([
    { studyMinutes: 0, shortBreakMinutes: 5, longBreakMinutes: 15, cycleTarget: 4 },
    { studyMinutes: 25.5, shortBreakMinutes: 5, longBreakMinutes: 15, cycleTarget: 4 },
    { studyMinutes: 25, shortBreakMinutes: 0, longBreakMinutes: 15, cycleTarget: 4 },
    { studyMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 16, cycleTarget: 4 },
    { studyMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, cycleTarget: 5 },
  ])("rejects invalid values: %p", (settings) => {
    expect(validateCycleSettings(settings)).toEqual({
      valid: false,
      error: expect.any(String),
    });
  });
});
