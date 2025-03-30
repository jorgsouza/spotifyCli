import dbus from 'dbus-next';
import { SpotifyService } from '../../domain/services/SpotifyService.js';
import { Track } from '../../domain/entities/Track.js';

export class DBusSpotifyService extends SpotifyService {
  constructor(client = 'spotify') {
    super();
    this.client = client;
    this.bus = dbus.sessionBus();
    this.debug = process.env.SPOTIFY_CLI_DEBUG === 'true';
  }

  setClient(client) {
    this.client = client;
  }
  
  log(...args) {
    if (this.debug) {
      console.log('[DEBUG]', ...args);
    }
  }

  async getSpotifyPlayer() {
    try {
      this.log(`Connecting to ${this.client} via DBus...`);
      const proxyObject = await this.bus.getProxyObject(
        `org.mpris.MediaPlayer2.${this.client}`,
        '/org/mpris/MediaPlayer2'
      );
      return proxyObject.getInterface('org.mpris.MediaPlayer2.Player');
    } catch (error) {
      throw new Error(`Failed to connect to Spotify: ${error.message}`);
    }
  }

  async getCurrentTrack() {
    try {
      const player = await this.getSpotifyPlayer();
      this.log('Getting track metadata...');
      
      const status = await player.PlaybackStatus;
      this.log('Playback status:', status);
      
      if (status !== 'Playing') {
        throw new Error('Playback is stopped or paused. Start playing a track in Spotify first.');
      }
      
      const metadata = await player.Metadata;
      this.log('Raw metadata:', JSON.stringify(metadata, null, 2));
      
      if (!metadata || !metadata['xesam:title']) {
        throw new Error('No track metadata available. Is a song playing?');
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
      return status || 'Stopped';
    } catch (error) {
      this.log('Error while getting playback status:', error.message);
      return 'Stopped'; // Retornar "Stopped" como fallback
    }
  }

  async getPosition() {
    const player = await this.getSpotifyPlayer();
    return await player.Position;
  }
}
