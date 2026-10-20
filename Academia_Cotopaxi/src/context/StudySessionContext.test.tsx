import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { StudySessionProvider, useStudySession } from "./StudySessionContext";
import { createInitialSession } from "../utils/session";
import * as storage from "../storage/sessionStorage";
import * as notifications from "../services/notificationService";

jest.mock("../storage/sessionStorage");
jest.mock("../services/notificationService");

function Probe({ onValue }: { onValue: (value: ReturnType<typeof useStudySession>) => void }) {
  onValue(useStudySession());
  return null;
}

describe("StudySessionContext", () => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(100_000);
    jest.mocked(storage.loadStudySession).mockResolvedValue(null);
    jest.mocked(storage.saveStudySession).mockResolvedValue();
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: true,
    });
    jest.mocked(notifications.scheduleFinishNotification).mockResolvedValue({
      available: true,
      notificationId: "notification-id",
    });
    jest.mocked(notifications.cancelFinishNotification).mockResolvedValue({
      available: true,
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it("restores a saved paused session and persists transitions", async () => {
    const saved = { ...createInitialSession(1500), status: "paused" as const, remainingSeconds: 900 };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session).toEqual(saved);
    await act(async () => {
      await value.start();
    });
    expect(value.session.status).toBe("running");
    expect(storage.saveStudySession).toHaveBeenCalled();
  });

  it("exposes persistence errors and keeps the last confirmed state", async () => {
    jest.mocked(storage.saveStudySession).mockRejectedValue(new Error("write"));
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    const initial = value.session;

    await act(async () => {
      await value.start();
    });

    expect(value.session).toEqual(initial);
    expect(value.error).toEqual(expect.any(String));
  });

  it("restores one prepared transition after a running study expires", async () => {
    const expired = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running" as const,
      endTimestamp: 90_000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(expired);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session).toMatchObject({
      phase: "shortBreak",
      status: "stopped",
      completedPomodoros: 1,
      remainingSeconds: 300,
    });
    expect(storage.saveStudySession).toHaveBeenCalledWith(
      expect.objectContaining({ phase: "shortBreak", completedPomodoros: 1 }),
    );
  });

  afterEach(() => {
    renderer?.unmount();
  });
});
