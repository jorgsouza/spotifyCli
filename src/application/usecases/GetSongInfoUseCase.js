export class GetSongInfoUseCase {
  constructor(spotifyService, type) {
    this.spotifyService = spotifyService;
    this.type = type; // Tipo de informação: song, songshort, artist, artistshort, album, arturl
  }

  async execute() {
    const track = await this.spotifyService.getCurrentTrack();

    switch (this.type) {
      case 'song':
        return track.title;
      case 'songshort':
        return track.title.length > 20 ? `${track.title.slice(0, 17)}...` : track.title;
      case 'artist':
        return track.artist;
      case 'artistshort':
        return track.artist.length > 20 ? `${track.artist.slice(0, 17)}...` : track.artist;
      case 'album':
        return track.album;
      case 'arturl':
        return track.artUrl || 'No album art available';
      default:
        throw new Error('Invalid type for GetSongInfoUseCase');
    }
  }
}
