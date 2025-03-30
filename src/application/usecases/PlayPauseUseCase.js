import { CommandHandler } from '../interfaces/CommandHandler.js';
import { PlaybackStatus } from '../../domain/value-objects/PlaybackStatus.js';

export class PlayPauseCommand {
  constructor() {
    // No parameters needed
  }
}

export class PlayPauseUseCase extends CommandHandler {
  constructor(spotifyService) {
    super();
    this.spotifyService = spotifyService;
  }

  async execute() {
    const playbackStatus = await this.spotifyService.getPlaybackStatus();
    
    if (playbackStatus.isPlaying()) {
      await this.spotifyService.pause();
      return "Playback paused";
    } else {
      await this.spotifyService.play();
      return "Playback started";
    }
  }
}
