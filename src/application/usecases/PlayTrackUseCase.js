export class PlayTrackUseCase {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
  }

  async execute() {
    await this.spotifyService.play();
  }
}
