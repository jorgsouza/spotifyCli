import { formatTime } from '../../domain/utils/formatTime.js';

export class GetPositionUseCase {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
  }

  async execute() {
    const track = await this.spotifyService.getCurrentTrack();
    const position = await this.spotifyService.getPosition();
    return `${track.artist} - ${track.title} [${formatTime(position)}/${formatTime(track.trackLength)}]`;
  }
}
