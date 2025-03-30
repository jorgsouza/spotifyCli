export class PauseTrackUseCase {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
  }

  async execute() {
    await this.spotifyService.pause();
  }
}
