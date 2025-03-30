export class PlaybackStatus {
  static PLAYING = 'Playing';
  static PAUSED = 'Paused';
  static STOPPED = 'Stopped';
  
  constructor(status) {
    this.validateStatus(status);
    this.status = status;
  }
  
  validateStatus(status) {
    const validStatuses = [PlaybackStatus.PLAYING, PlaybackStatus.PAUSED, PlaybackStatus.STOPPED];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid playback status: ${status}`);
    }
  }
  
  isPlaying() {
    return this.status === PlaybackStatus.PLAYING;
  }
  
  isPaused() {
    return this.status === PlaybackStatus.PAUSED;
  }
  
  isStopped() {
    return this.status === PlaybackStatus.STOPPED;
  }
  
  toString() {
    return this.status;
  }
}
