import { createInitialSession } from "./cycle";

describe("cycle contract", () => {
  it("creates a study session with the configured cycle target", () => {
    expect(createInitialSession(1500, 300, 900, 4)).toEqual({
      version: 2,
      phase: "study",
      status: "stopped",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: null,
      completedPomodoros: 0,
      cycleTarget: 4,
    });
  });
});
