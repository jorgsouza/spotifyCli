import { CommandHandler } from '../interfaces/CommandHandler.js';
import { TrackPosition } from '../../domain/value-objects/TrackPosition.js';

export class GetPositionCommand {
  constructor() {
    // No parameters needed
  }
}

export class GetPositionUseCase extends CommandHandler {
  constructor(spotifyService) {
    super();
    this.spotifyService = spotifyService;
  }

  async execute() {
    const track = await this.spotifyService.getCurrentTrack();
    const position = await this.spotifyService.getTrackPosition();
    const trackPosition = new TrackPosition(position, track.trackLength);
    
    return `${track.displayName} [${trackPosition.formattedString}]`;
  }
}
