export const calculateMiningReward = (
  baseRate: number,
  multiplier: number,
  elapsedSeconds: number
): number => {
  const effectiveRate = baseRate * multiplier;
  return effectiveRate * elapsedSeconds;
};

export const getElapsedSeconds = (startTime: string): number => {
  const start = parseDate(startTime);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 1000);
};

export const parseDate = (dateStr: string): Date => {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/');
  const [hours, minutes, seconds] = timePart.split(':');
  
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  );
};

export const isSessionComplete = (
  startTime: string,
  selectedHour: number
): boolean => {
  const elapsedSeconds = getElapsedSeconds(startTime);
  const totalSeconds = selectedHour * 3600;
  return elapsedSeconds >= totalSeconds;
};

export const getRemainingSeconds = (
  startTime: string,
  selectedHour: number
): number => {
  const elapsedSeconds = getElapsedSeconds(startTime);
  const totalSeconds = selectedHour * 3600;
  return Math.max(0, totalSeconds - elapsedSeconds);
};
