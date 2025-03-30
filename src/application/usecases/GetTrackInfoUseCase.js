import { TrackInfoService } from '../../domain/services/TrackInfoService.js';

export class GetTrackInfoUseCase {
  constructor(spotifyService, type) {
    this.spotifyService = spotifyService;
    this.type = type; // Tipo de informação: song, songshort, artist, artistshort, album, arturl
  }

  async execute() {
    try {
      const track = await this.spotifyService.getCurrentTrack();
      return TrackInfoService.getInfo(track, this.type);
    } catch (error) {
      throw new Error(`Unable to get track information: ${error.message}`);
    }
  }
}
