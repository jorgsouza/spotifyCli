export function formatTime(microseconds) {
  const totalSeconds = Math.floor(microseconds / 1000000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
