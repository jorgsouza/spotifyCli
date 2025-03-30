import { TrackInfoService } from '../../domain/services/TrackInfoService.js';
import { CommandHandler } from '../interfaces/CommandHandler.js';
import { NoTrackPlayingError, MetadataError } from '../../domain/errors/SpotifyServiceError.js';

export class GetTrackInfoCommand {
  constructor(infoType) {
    this.infoType = infoType;
  }
}

export class GetTrackInfoUseCase extends CommandHandler {
  constructor(spotifyService, infoType) {
    super();
    this.spotifyService = spotifyService;
    this.infoType = infoType; // Store the info type in the use case
  }

  async execute(command = null) {
    try {
      // Get the info type from either the command or the use case itself
      const infoType = command?.infoType || this.infoType;
      
      if (!infoType) {
        throw new Error('No info type specified');
      }
      
      const track = await this.spotifyService.getCurrentTrack();
      
      if (!track) {
        throw new MetadataError();
      }
      
      return TrackInfoService.getInfo(track, infoType);
    } catch (error) {
      if (error instanceof NoTrackPlayingError) {
        throw new Error(`Unable to get track information: No track is currently playing`);
      }
      if (error instanceof MetadataError) {
        throw new Error(`Unable to get track information: No track metadata available`);
      }
      throw new Error(`Unable to get track information: ${error.message}`);
    }
  }
}
