export class GetStatusUseCase {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
  }

  async execute() {
    const track = await this.spotifyService.getCurrentTrack();
    const playbackStatus = await this.spotifyService.getPlaybackStatus();
    return `${track.artist} - ${track.title} [${playbackStatus}]`;
  }
}
