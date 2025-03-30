import { TrackInfoService } from '../../domain/services/TrackInfoService.js';
import { CommandHandler } from '../interfaces/CommandHandler.js';
import { NoTrackPlayingError } from '../../domain/errors/SpotifyServiceError.js';

export class GetTrackInfoCommand {
  constructor(infoType) {
    this.infoType = infoType;
  }
}

export class GetTrackInfoUseCase extends CommandHandler {
  constructor(spotifyService) {
    super();
    this.spotifyService = spotifyService;
  }

  async execute(command) {
    try {
      const track = await this.spotifyService.getCurrentTrack();
      return TrackInfoService.getInfo(track, command.infoType);
    } catch (error) {
      if (error instanceof NoTrackPlayingError) {
        throw new Error(`Unable to get track information: No track is currently playing`);
      }
      throw new Error(`Unable to get track information: ${error.message}`);
    }
  }
}
