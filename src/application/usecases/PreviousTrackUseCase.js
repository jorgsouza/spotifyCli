export class PreviousTrackUseCase {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
  }

  async execute() {
    await this.spotifyService.previous();
  }
}
