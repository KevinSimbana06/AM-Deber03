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

describe("study session storage v3", () => {
  beforeEach(() => jest.clearAllMocks());

  it("saves and loads the approved versioned contract (version 3)", async () => {
    const session = createInitialSession(1500);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 3, session }),
    );

    await saveStudySession(session);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "pomodoro.activeSession",
      JSON.stringify({ version: 3, session }),
    );
    await expect(loadStudySession()).resolves.toEqual(session);
  });

  it("returns null when no session exists", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    await expect(loadStudySession()).resolves.toBeNull();
  });

  it("migrates a valid version 1 session to version 3", async () => {
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
      version: 3,
      phase: "study",
      status: "paused",
      initialDurationSeconds: 1500,
      remainingSeconds: 900,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: null,
    });
  });

  it("migrates a valid version 2 session to version 3", async () => {
    const legacyV2 = {
      version: 2,
      phase: "shortBreak",
      status: "paused",
      initialDurationSeconds: 300,
      remainingSeconds: 150,
      endTimestamp: null,
      completedPomodoros: 2,
      cycleTarget: 4,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 2, session: legacyV2 }),
    );

    await expect(loadStudySession()).resolves.toMatchObject({
      version: 3,
      phase: "shortBreak",
      status: "paused",
      initialDurationSeconds: 300,
      remainingSeconds: 150,
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: null,
    });
  });

  it("rejects unknown versions and corrupt sessions explicitly", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 99, session: {} }),
    );
    await expect(loadStudySession()).rejects.toMatchObject({ operation: "invalid" });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid json string");
    await expect(loadStudySession()).rejects.toMatchObject({ operation: "invalid" });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        version: 3,
        session: {
          version: 3,
          phase: "invalid-phase",
        },
      }),
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
      JSON.stringify({ version: 3, session: prepared }),
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
