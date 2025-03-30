export class Track {
  constructor({ artist, title, album, artUrl, trackId, trackLength }) {
    this.artist = artist || 'Unknown Artist';
    this.title = title || 'Unknown Title';
    this.album = album || 'Unknown Album';
    this.artUrl = artUrl || null;
    this.trackId = trackId || null;
    this.trackLength = trackLength || 0;
  }
}
