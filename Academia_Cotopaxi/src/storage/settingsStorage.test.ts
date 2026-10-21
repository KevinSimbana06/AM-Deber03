import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadSettings, saveSettings, SETTINGS_STORAGE_KEY } from "./settingsStorage";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";
import type { PomodoroSettings } from "../types/pomodoro";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("settingsStorage (RF-005, RF-011, RNF-001, RNF-002)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadSettings", () => {
    it("returns default settings (25/5/15/4) when no settings are stored", async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);

      const result = await loadSettings();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(SETTINGS_STORAGE_KEY);
      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });

    it("returns saved settings when stored JSON is valid", async () => {
      const customSettings: PomodoroSettings = {
        studyDurationMinutes: 50,
        shortBreakMinutes: 10,
        longBreakMinutes: 20,
        cycleTarget: 4,
      };
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(customSettings));

      const result = await loadSettings();

      expect(result).toEqual(customSettings);
    });

    it("silently recovers with default settings when stored JSON is malformed (RF-011)", async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce("{invalid-json-content");

      const result = await loadSettings();

      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });

    it("silently recovers with default settings when stored data contains invalid ranges", async () => {
      const invalidData = {
        studyDurationMinutes: 10, // Invalid (<25)
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      };
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(invalidData));

      const result = await loadSettings();

      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });

    it("gracefully recovers with default settings when AsyncStorage throws", async () => {
      jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error("AsyncStorage read failure"));

      const result = await loadSettings();

      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });
  });

  describe("saveSettings", () => {
    it("serializes and saves valid settings under @pomodoro_settings", async () => {
      const customSettings: PomodoroSettings = {
        studyDurationMinutes: 45,
        shortBreakMinutes: 8,
        longBreakMinutes: 20,
        cycleTarget: 6,
      };
      jest.mocked(AsyncStorage.setItem).mockResolvedValueOnce();

      await saveSettings(customSettings);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(customSettings),
      );
    });

    it("rejects and does not write if settings are invalid", async () => {
      const invalidSettings: PomodoroSettings = {
        studyDurationMinutes: 20, // Invalid
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      };

      await expect(saveSettings(invalidSettings)).rejects.toThrow();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it("rethrows error when AsyncStorage.setItem fails as a typed StorageError", async () => {
      const validSettings: PomodoroSettings = {
        studyDurationMinutes: 30,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      };
      jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error("Write error"));

      await expect(saveSettings(validSettings)).rejects.toMatchObject({
        name: "StorageError",
        operation: "write",
      });
    });

    it("restricts persisted settings strictly to approved fields without user id or telemetry (RF-006, RNF-003)", async () => {
      const settingsWithExtra = {
        studyDurationMinutes: 35,
        shortBreakMinutes: 6,
        longBreakMinutes: 18,
        cycleTarget: 4,
        userId: "student-12345",
        deviceTelemetry: { os: "android" },
      } as unknown as PomodoroSettings;

      jest.mocked(AsyncStorage.setItem).mockResolvedValueOnce();

      await saveSettings(settingsWithExtra);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          studyDurationMinutes: 35,
          shortBreakMinutes: 6,
          longBreakMinutes: 18,
          cycleTarget: 4,
        }),
      );
    });
  });
});
