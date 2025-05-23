// src/model/attendanceUtils.ts

export function isEligibleForIncentive(login: string, logout: string) {
    const toMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
  
    const loginMinutes = toMinutes(login);
    const logoutMinutes = toMinutes(logout);
  
    return {
      morning: loginMinutes <= 480,  // 08:00 AM = 480 minutes
      evening: logoutMinutes >= 1140 // 07:00 PM = 1140 minutes
    };
  }
  