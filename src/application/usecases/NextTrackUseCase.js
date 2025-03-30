export class NextTrackUseCase {
  constructor(spotifyService) {
    this.spotifyService = spotifyService;
  }

  async execute() {
    await this.spotifyService.next();
  }
}
