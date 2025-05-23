
export function computeDailyIncentive(attendance: {
  timeIn: Date
  timeOut: Date | null
}) {
  const toIST = (utcDate: Date) =>
    new Date(utcDate.getTime() + 6.5 * 60 * 60 * 1000); // Convert UTC to IST

  // Convert to IST
  const timeInIST = toIST(attendance.timeIn);
  const timeOutIST = attendance.timeOut ? toIST(attendance.timeOut) : null;
  const nowIST = toIST(new Date());

  // Log the raw times (for debugging)
  console.log("Raw TimeIn IST:", timeInIST);
  console.log("Raw TimeOut IST:", timeOutIST);

  const isMorningEligible =
    timeInIST.getHours() < 8 || (timeInIST.getHours() === 8 && timeInIST.getMinutes() === 0);

  let evening: number | string = '🕓 Pending';
  if (nowIST.getHours() >= 19) {
    if (!timeOutIST) {
      evening = '₹-';
    } else {
      const isEveningEligible =
        timeOutIST.getHours() > 19 ||
        (timeOutIST.getHours() === 19 && timeOutIST.getMinutes() === 0);
      evening = isEveningEligible ? 100 : '₹-';
    }
  }

  const morning = isMorningEligible ? 100 : '₹-';
  const total = (morning === 100 ? 100 : 0) + (evening === 100 ? 100 : 0);

  return {
    timeInIST,
    timeOutIST,
    morning,
    evening,
    total,
  };
}

// Helper to format the time as AM/PM using Asia/Kolkata timezone
const formatTime = (date: Date | null, timeZone: string) => {
  return date
    ? date.toLocaleTimeString('en-IN', {
        timeZone,               // Ensure correct timezone
        hour: '2-digit',        // Show hours in 2-digit format
        minute: '2-digit',      // Show minutes in 2-digit format
        second: '2-digit',      // Show seconds in 2-digit format
        hour12: true,           // Force AM/PM format
      })
    : '—';
}

// Usage in your page
export function logFormattedTimes(attendance: { timeIn: Date; timeOut: Date | null }) {
  const result = computeDailyIncentive(attendance);
  const formattedTimeIn = formatTime(result.timeInIST, 'Asia/Kolkata');
  const formattedTimeOut = result.timeOutIST ? formatTime(result.timeOutIST, 'Asia/Kolkata') : '—';

  // Log the formatted times for debugging
  console.log(`Formatted TimeIn: ${formattedTimeIn}`);
  console.log(`Formatted TimeOut: ${formattedTimeOut}`);
}
