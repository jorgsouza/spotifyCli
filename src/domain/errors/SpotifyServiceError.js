export class SpotifyServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SpotifyServiceError';
  }
}

export class NoTrackPlayingError extends SpotifyServiceError {
  constructor() {
    super('No track is currently playing');
    this.name = 'NoTrackPlayingError';
  }
}

export class ConnectionError extends SpotifyServiceError {
  constructor(message) {
    super(`Failed to connect to Spotify: ${message}`);
    this.name = 'ConnectionError';
  }
}

export class MetadataError extends SpotifyServiceError {
  constructor() {
    super('No track metadata available');
    this.name = 'MetadataError';
  }
}
