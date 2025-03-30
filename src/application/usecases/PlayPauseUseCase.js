export class PlayPauseUseCase {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
  }

  async execute() {
    const playbackStatus = await this.spotifyService.getPlaybackStatus();
    if (playbackStatus === 'Playing') {
      await this.spotifyService.pause();
    } else {
      await this.spotifyService.play();
    }
  }
}
