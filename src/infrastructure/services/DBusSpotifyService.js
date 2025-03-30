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
    this._propertiesInterface = null;
  }

  setClient(client) {
    this.client = client;
    this._playerInterface = null; // Reset cached interfaces when client changes
    this._propertiesInterface = null;
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
      this._propertiesInterface = proxyObject.getInterface('org.freedesktop.DBus.Properties');
      return this._playerInterface;
    } catch (error) {
      throw new ConnectionError(error.message);
    }
  }

  async getSpotifyProperty(propertyName) {
    try {
      // Make sure we have a player connection
      await this.getSpotifyPlayer();
      
      if (!this._propertiesInterface) {
        throw new Error('Properties interface not available');
      }
      
      this.log(`Getting Spotify property: ${propertyName}`);
      const result = await this._propertiesInterface.Get('org.mpris.MediaPlayer2.Player', propertyName);
      
      this.log(`Property ${propertyName} result:`, result);
      return result;
    } catch (error) {
      this.log(`Error getting property ${propertyName}:`, error);
      throw error;
    }
  }

  async getCurrentTrack() {
    try {
      const metadata = await this.getSpotifyProperty('Metadata');
      if (!metadata || Object.keys(metadata).length === 0) {
        throw new MetadataError('No metadata available');
      }

      const artist = Array.isArray(metadata['xesam:artist']) ? metadata['xesam:artist'].join(', ') : 'Unknown Artist';
      const title = metadata['xesam:title'] || 'Unknown Title';
      const album = metadata['xesam:album'] || 'Unknown Album';
      const artUrl = metadata['mpris:artUrl'] || null;
      const trackLength = metadata['mpris:length'] || 0;

      return new Track({
        artist,
        title,
        album,
        artUrl,
        trackLength,
      });
    } catch (error) {
      this.log('Error in getCurrentTrack:', error);
      if (error instanceof MetadataError) {
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
      const status = await this.getSpotifyProperty('PlaybackStatus');
      return new PlaybackStatus(status || 'Stopped');
    } catch (error) {
      this.log('Error while getting playback status:', error.message);
      return new PlaybackStatus('Stopped');
    }
  }

  async getTrackPosition() {
    try {
      const position = await this.getSpotifyProperty('Position');
      return position;
    } catch (error) {
      this.log('Error getting track position:', error.message);
      return 0;
    }
  }
}
