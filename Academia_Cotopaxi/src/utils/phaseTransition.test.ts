import { createInitialSession } from "./cycle";
import { completePhase, getEffectiveSession, type PhaseDurations } from "./phaseTransition";

const durations: PhaseDurations = {
  studySeconds: 1500,
  shortBreakSeconds: 300,
  longBreakSeconds: 900,
};

describe("phase transitions", () => {
  it.each([0, 1, 2])("prepares a short break after study %i", (completedPomodoros) => {
    const session = {
      ...createInitialSession(1500, 300, 900, 4),
      completedPomodoros,
      status: "running" as const,
      endTimestamp: 10_000,
    };

    const next = completePhase(session, durations);

    expect(next).toMatchObject({
      phase: "shortBreak",
      status: "stopped",
      completedPomodoros: completedPomodoros + 1,
      remainingSeconds: 300,
      endTimestamp: null,
    });
  });

  it("prepares a long break and resets the counter at the cycle target", () => {
    const session = {
      ...createInitialSession(1500, 300, 900, 4),
      completedPomodoros: 3,
      status: "running" as const,
      endTimestamp: 10_000,
    };

    expect(completePhase(session, durations)).toMatchObject({
      phase: "longBreak",
      completedPomodoros: 0,
      remainingSeconds: 900,
      status: "stopped",
    });
  });

  it("prepares study after either break without starting it", () => {
    for (const phase of ["shortBreak", "longBreak"] as const) {
      const session = {
        ...createInitialSession(1500, 300, 900, 4),
        phase,
        status: "running" as const,
        initialDurationSeconds: phase === "shortBreak" ? 300 : 900,
        remainingSeconds: 0,
        endTimestamp: 10_000,
        completedPomodoros: 1,
      };

      expect(completePhase(session, durations)).toMatchObject({
        phase: "study",
        status: "stopped",
        remainingSeconds: 1500,
        completedPomodoros: 1,
      });
    }
  });

  it("performs exactly one transition when a running phase has elapsed", () => {
    const session = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running" as const,
      endTimestamp: 10_000,
    };

    const next = getEffectiveSession(session, 20_000, durations);
    expect(next.phase).toBe("shortBreak");
    expect(next.status).toBe("stopped");
  });
});
