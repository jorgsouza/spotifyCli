import { CommandHandler } from '../interfaces/CommandHandler.js';

// Command classes for each control action
export class PlayCommand {}
export class PauseCommand {}
export class NextTrackCommand {}
export class PreviousTrackCommand {}

export class PlayerControlUseCase extends CommandHandler {
  constructor(spotifyService, action) {
    super();
    this.spotifyService = spotifyService;
    this.action = action;
  }

  async execute(command) {
    switch (this.action) {
      case 'play':
        await this.spotifyService.play();
        return "Playback started";
      case 'pause':
        await this.spotifyService.pause();
        return "Playback paused";
      case 'next':
        await this.spotifyService.next();
        return "Skipped to next track";
      case 'previous':
        await this.spotifyService.previous();
        return "Returned to previous track";
      default:
        throw new Error(`Unknown player control action: ${this.action}`);
    }
  }
}
