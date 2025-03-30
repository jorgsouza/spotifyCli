import { CommandHandler } from '../interfaces/CommandHandler.js';

export class GetStatusCommand {
  constructor() {
    // No parameters needed
  }
}

export class GetStatusUseCase extends CommandHandler {
  constructor(spotifyService) {
    super();
    this.spotifyService = spotifyService;
  }

  async execute() {
    const track = await this.spotifyService.getCurrentTrack();
    const playbackStatus = await this.spotifyService.getPlaybackStatus();
    
    return `${track.displayName} [${playbackStatus}]`;
  }
}
