import { validateStudyDuration } from "./settings";

describe("study duration validation", () => {
  it("accepts integer minutes from 1 through 100", () => {
    expect(validateStudyDuration(1)).toEqual({ valid: true });
    expect(validateStudyDuration(100)).toEqual({ valid: true });
  });

  it.each([0, -1, 101, 25.5, NaN, Infinity, "25", ""])(
    "rejects invalid value %p",
    (value) => {
      expect(validateStudyDuration(value)).toEqual({
        valid: false,
        error: expect.any(String),
      });
    },
  );
});
