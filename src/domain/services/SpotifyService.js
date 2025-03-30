import { NoTrackPlayingError } from '../errors/SpotifyServiceError.js';

export class SpotifyService {
  /**
   * Gets the currently playing track
   * @returns {Promise<Track>} The currently playing track
   * @throws {NoTrackPlayingError} When no track is playing
   */
  async getCurrentTrack() {
    throw new Error('Method not implemented');
  }

  /**
   * Starts or resumes playback
   * @returns {Promise<void>}
   */
  async play() {
    throw new Error('Method not implemented');
  }

  /**
   * Pauses playback
   * @returns {Promise<void>}
   */
  async pause() {
    throw new Error('Method not implemented');
  }

  /**
   * Skips to next track
   * @returns {Promise<void>}
   */
  async next() {
    throw new Error('Method not implemented');
  }

  /**
   * Returns to previous track
   * @returns {Promise<void>}
   */
  async previous() {
    throw new Error('Method not implemented');
  }

  /**
   * Gets current playback status
   * @returns {Promise<PlaybackStatus>} Current playback status
   */
  async getPlaybackStatus() {
    throw new Error('Method not implemented');
  }
  
  /**
   * Gets current track position
   * @returns {Promise<TrackPosition>} Current track position
   * @throws {NoTrackPlayingError} When no track is playing
   */
  async getTrackPosition() {
    throw new Error('Method not implemented');
  }
}
