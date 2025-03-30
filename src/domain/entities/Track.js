export class Track {
  constructor({ artist, title, album, artUrl, trackId, trackLength }) {
    this._validateTrack({ artist, title, album });
    
    this.artist = artist || 'Unknown Artist';
    this.title = title || 'Unknown Title';
    this.album = album || 'Unknown Album';
    this.artUrl = artUrl || null;
    this.trackId = trackId || null;
    this.trackLength = trackLength || 0;
  }
  
  _validateTrack({ artist, title, album }) {
    // Basic validation to ensure we have the minimum data needed
    if (!artist && !title && !album) {
      throw new Error('Track information is incomplete');
    }
  }
  
  get isValid() {
    return this.title !== 'Unknown Title' && this.artist !== 'Unknown Artist';
  }
  
  get displayName() {
    return `${this.artist} - ${this.title}`;
  }
  
  get shortDisplayName() {
    return `${this.getShortText(this.artist)} - ${this.getShortText(this.title)}`;
  }
  
  getShortText(text, maxLength = 17) {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }
}
