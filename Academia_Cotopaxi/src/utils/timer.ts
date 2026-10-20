export function getRemainingSeconds(
  endTimestamp: number,
  currentTimestamp: number = Date.now(),
): number {
  return Math.max(0, Math.ceil((endTimestamp - currentTimestamp) / 1000));
}

export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
