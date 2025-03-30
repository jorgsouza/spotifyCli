import dbus from 'dbus-next';
import { SpotifyService } from '../../domain/services/SpotifyService.js';
import { Track } from '../../domain/entities/Track.js';
import { PlaybackStatus } from '../../domain/value-objects/PlaybackStatus.js';
import { 
  ConnectionError, 
  NoTrackPlayingError, 
  MetadataError 
} from '../../domain/errors/SpotifyServiceError.js';

export class DBusSpotifyService extends SpotifyService {
  constructor(client = 'spotify') {
    super();
    this.client = client;
    this.bus = dbus.sessionBus();
    this.debug = process.env.SPOTIFY_CLI_DEBUG === 'true';
    this._playerInterface = null;
  }

  setClient(client) {
    this.client = client;
    this._playerInterface = null; // Reset cached interface when client changes
  }
  
  log(...args) {
    if (this.debug) {
      console.log('[DEBUG]', ...args);
    }
  }

  async getSpotifyPlayer() {
    if (this._playerInterface) {
      return this._playerInterface;
    }
    
    try {
      this.log(`Connecting to ${this.client} via DBus...`);
      const proxyObject = await this.bus.getProxyObject(
        `org.mpris.MediaPlayer2.${this.client}`,
        '/org/mpris/MediaPlayer2'
      );
      this._playerInterface = proxyObject.getInterface('org.mpris.MediaPlayer2.Player');
      return this._playerInterface;
    } catch (error) {
      throw new ConnectionError(error.message);
    }
  }

  async getCurrentTrack() {
    try {
      const player = await this.getSpotifyPlayer();
      this.log('Getting track metadata...');
      
      const statusString = await player.PlaybackStatus;
      this.log('Playback status:', statusString);
      
      const status = new PlaybackStatus(statusString);
      
      if (!status.isPlaying()) {
        throw new NoTrackPlayingError();
      }
      
      const metadata = await player.Metadata;
      this.log('Raw metadata:', JSON.stringify(metadata, null, 2));
      
      if (!metadata || !metadata['xesam:title']) {
        throw new MetadataError();
      }

      return new Track({
        artist: Array.isArray(metadata['xesam:artist']) && metadata['xesam:artist'].length > 0 
          ? metadata['xesam:artist'].join(', ') 
          : 'Unknown Artist',
        title: metadata['xesam:title'] || 'Unknown Title',
        album: metadata['xesam:album'] || 'Unknown Album',
        artUrl: metadata['mpris:artUrl'] || null,
        trackId: metadata['mpris:trackid'] || null,
        trackLength: metadata['mpris:length'] || 0,
      });
    } catch (error) {
      this.log('Error while getting current track:', error.message);
      
      if (error instanceof ConnectionError || 
          error instanceof NoTrackPlayingError ||
          error instanceof MetadataError) {
        throw error;
      }
      
      throw new Error(`Failed to get current track: ${error.message}`);
    }
  }

  async play() {
    const player = await this.getSpotifyPlayer();
    await player.Play();
  }

  async pause() {
    const player = await this.getSpotifyPlayer();
    await player.Pause();
  }

  async next() {
    const player = await this.getSpotifyPlayer();
    await player.Next();
  }

  async previous() {
    const player = await this.getSpotifyPlayer();
    await player.Previous();
  }

  async getPlaybackStatus() {
    try {
      const player = await this.getSpotifyPlayer();
      const status = await player.PlaybackStatus;
      return new PlaybackStatus(status || 'Stopped');
    } catch (error) {
      this.log('Error while getting playback status:', error.message);
      return new PlaybackStatus('Stopped');
    }
  }

  async getTrackPosition() {
    const player = await this.getSpotifyPlayer();
    return await player.Position;
  }
}
