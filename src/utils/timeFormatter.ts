/**
 * Format time in seconds to mm:ss or hh:mm:ss format
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";

  seconds = Math.floor(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}; 