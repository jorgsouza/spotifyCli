export class TrackInfoService {
  static getInfo(track, type) {
    if (!track) {
      throw new Error('Cannot get info from undefined track');
    }
    
    switch (type) {
      case 'song':
      case 'track':
        return track.title;
      case 'songshort':
      case 'trackshort':
        return track.getShortText(track.title);
      case 'artist':
        return track.artist;
      case 'artistshort':
        return track.getShortText(track.artist);
      case 'album':
        return track.album;
      case 'arturl':
        return track.artUrl || 'No album art available';
      case 'display':
        return track.displayName;
      default:
        throw new Error(`Invalid info type: ${type}`);
    }
  }
}
