import {
  ALARM_TIMEOUT_MS,
  getAlarmNotificationContent,
  isAlarmExpired,
} from "./alarmMessages";

describe("alarmMessages pure utilities", () => {
  describe("getAlarmNotificationContent", () => {
    it("returns study finished message with short break duration (RF-006)", () => {
      const content = getAlarmNotificationContent("study", "shortBreak", 5);
      expect(content).toEqual({
        title: "¡Estudio terminado!",
        body: "Bien hecho. Listo para descanso corto (5 min)",
      });
    });

    it("returns study finished message with long break duration when cycle completed (RF-006)", () => {
      const content = getAlarmNotificationContent("study", "longBreak", 15);
      expect(content).toEqual({
        title: "¡Estudio terminado!",
        body: "Bien hecho. Listo para descanso largo (15 min)",
      });
    });

    it("returns short break finished message motivating next study session (RF-006)", () => {
      const content = getAlarmNotificationContent("shortBreak", "study", 25);
      expect(content).toEqual({
        title: "¡Descanso terminado!",
        body: "Tiempo de concentrarse en la siguiente sesión de estudio",
      });
    });

    it("returns long break finished message motivating next study session (RF-006)", () => {
      const content = getAlarmNotificationContent("longBreak", "study", 25);
      expect(content).toEqual({
        title: "¡Descanso terminado!",
        body: "Tiempo de concentrarse en la siguiente sesión de estudio",
      });
    });
  });

  describe("isAlarmExpired (RF-007)", () => {
    it("defines 60 seconds as the safety cutoff constant", () => {
      expect(ALARM_TIMEOUT_MS).toBe(60_000);
    });

    it("returns false if alarm duration is under 60 seconds", () => {
      const start = 1_000_000;
      expect(isAlarmExpired(start, start + 30_000)).toBe(false);
      expect(isAlarmExpired(start, start + 59_999)).toBe(false);
    });

    it("returns true when 60 seconds or more have elapsed", () => {
      const start = 1_000_000;
      expect(isAlarmExpired(start, start + 60_000)).toBe(true);
      expect(isAlarmExpired(start, start + 65_000)).toBe(true);
    });
  });
});
