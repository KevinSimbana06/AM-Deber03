import AsyncStorage from "@react-native-async-storage/async-storage";
import { createInitialSession } from "../utils/session";
import {
  loadStudySession,
  saveStudySession,
  StorageError,
} from "./sessionStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe("study session storage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("saves and loads the approved versioned contract", async () => {
    const session = createInitialSession(1500);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 2, session }),
    );

    await saveStudySession(session);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "pomodoro.activeSession",
      JSON.stringify({ version: 2, session }),
    );
    await expect(loadStudySession()).resolves.toEqual(session);
  });

  it("returns null when no session exists", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    await expect(loadStudySession()).resolves.toBeNull();
  });

  it("migrates a valid version 1 session to version 2", async () => {
    const legacy = {
      phase: "study",
      status: "paused",
      initialDurationSeconds: 1500,
      remainingSeconds: 900,
      endTimestamp: null,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 1, session: legacy }),
    );

    await expect(loadStudySession()).resolves.toMatchObject({
      version: 2,
      phase: "study",
      completedPomodoros: 0,
      cycleTarget: 4,
    });
  });

  it("rejects unknown versions and invalid sessions explicitly", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 99, session: {} }),
    );
    await expect(loadStudySession()).rejects.toMatchObject({ operation: "invalid" });
  });

  it("restores a prepared phase without consuming its duration", async () => {
    const prepared = {
      ...createInitialSession(1500, 300, 900, 4),
      phase: "shortBreak" as const,
      initialDurationSeconds: 300,
      remainingSeconds: 300,
      completedPomodoros: 1,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 2, session: prepared }),
    );

    await expect(loadStudySession()).resolves.toEqual(prepared);
  });

  it("exposes differentiated read and write errors", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("read"));
    await expect(loadStudySession()).rejects.toMatchObject({
      operation: "read",
    });

    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error("write"));
    await expect(saveStudySession(createInitialSession(1500))).rejects.toMatchObject({
      operation: "write",
    });
    expect(new StorageError("read", "x")).toBeInstanceOf(Error);
  });
});
