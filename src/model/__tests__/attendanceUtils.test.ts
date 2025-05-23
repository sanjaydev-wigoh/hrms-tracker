// src/model/__tests__/attendanceUtils.test.ts

import { isEligibleForIncentive } from "../../services/attendanceUtils";

describe("Attendance Logic", () => {
  it("should be eligible for both bonuses", () => {
    const res = isEligibleForIncentive("07:55", "19:15");
    expect(res).toEqual({ morning: true, evening: true });
  });
  it("should be not eligible for both bonuses", () => {
    const res = isEligibleForIncentive("08:01", "18:59");
    expect(res).toEqual({ morning: false, evening: false });
  });
  it("should not be not eligible for both bonuses", () => {
    const res = isEligibleForIncentive("07:55", "19:15");
    expect(res).not.toEqual({ morning: false, evening: false });
  });

  it("should be eligible for morning bonus only", () => {
    const res = isEligibleForIncentive("07:55", "18:59");
    expect(res).toEqual({ morning: true, evening: false });
  });
  it("should be eligible for evening bonus only", () => {
    const res = isEligibleForIncentive("08:01", "19:15");
    expect(res).toEqual({ morning: false, evening: true });
  });
});