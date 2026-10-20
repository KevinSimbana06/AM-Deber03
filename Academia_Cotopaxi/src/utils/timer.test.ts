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

  it("limits remaining seconds to maxSeconds if clock was moved backwards", () => {
    // 25 minutes nominal = 1500s. Clock moved back so calculated diff is 2000s
    const end = 2_000_000;
    const current = 0;
    expect(getRemainingSeconds(end, current, 1500)).toBe(1500);
  });

  it("respects calculated remaining seconds when less than maxSeconds", () => {
    const end = 1_200_000;
    const current = 1_000_000;
    expect(getRemainingSeconds(end, current, 1500)).toBe(200);
  });
});

