import {
  getEffectiveSession,
  pauseSession,
  resetSession,
  startSession,
} from "./session";
import { createInitialSession } from "./cycle";

describe("study session transitions", () => {
  it("starts with the configured duration and starts from a timestamp", () => {
    const initial = createInitialSession(1500, 300, 900, 4);
    const running = startSession(initial, 10_000);

    expect(initial.status).toBe("stopped");
    expect(running).toMatchObject({
      status: "running",
      remainingSeconds: 1500,
      endTimestamp: 1_510_000,
    });
  });

  it("pauses using the exact elapsed time and resumes from the saved remainder", () => {
    const running = startSession(createInitialSession(1500, 300, 900, 4), 10_000);
    const paused = pauseSession(running, 310_000);
    const resumed = startSession(paused, 500_000);

    expect(paused).toMatchObject({
      status: "paused",
      remainingSeconds: 1200,
      endTimestamp: null,
    });
    expect(resumed.endTimestamp).toBe(1_700_000);
  });

  it("finishes at zero without an automatic next phase", () => {
    const running = startSession(createInitialSession(60, 300, 900, 4), 10_000);
    const finished = getEffectiveSession(running, 70_000);

    expect(finished).toMatchObject({
      status: "finished",
      remainingSeconds: 0,
      endTimestamp: null,
    });
  });

  it("resets only after explicit confirmation", () => {
    const running = startSession(createInitialSession(60, 300, 900, 4), 10_000);
    expect(resetSession(running, false)).toEqual(running);
    expect(resetSession(running, true)).toMatchObject({
      status: "stopped",
      remainingSeconds: 60,
      endTimestamp: null,
    });
  });
});
