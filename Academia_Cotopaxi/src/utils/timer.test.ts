import { formatTime, getRemainingSeconds } from "./timer";

describe("timer utilities", () => {
  it("calculates remaining seconds from the end timestamp", () => {
    expect(getRemainingSeconds(130_000, 100_000)).toBe(30);
  });

  it("returns zero when the timestamp has elapsed", () => {
    expect(getRemainingSeconds(99_000, 100_000)).toBe(0);
  });

  it("formats minutes and seconds with leading zeroes", () => {
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(0)).toBe("00:00");
  });
});
