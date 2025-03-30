#!/usr/bin/env node

import { Command } from 'commander';
import { DBusSpotifyService } from '../infrastructure/services/DBusSpotifyService.js';
import { PlayTrackUseCase } from '../application/usecases/PlayTrackUseCase.js';
import { PauseTrackUseCase } from '../application/usecases/PauseTrackUseCase.js';
import { NextTrackUseCase } from '../application/usecases/NextTrackUseCase.js';
import { PreviousTrackUseCase } from '../application/usecases/PreviousTrackUseCase.js';
import { GetStatusUseCase } from '../application/usecases/GetStatusUseCase.js';
import { GetPositionUseCase } from '../application/usecases/GetPositionUseCase.js';
import { PlayPauseUseCase } from '../application/usecases/PlayPauseUseCase.js';
import { GetTrackInfoUseCase } from '../application/usecases/GetTrackInfoUseCase.js';

// Only show version in standard mode
if (process.env.SPOTIFY_CLI_DEBUG !== 'true') {
  // console.log('Spotify CLI for Linux v1.9.2');
}

const program = new Command();
const spotifyService = new DBusSpotifyService();

// Add global options
program
  .option('--client <name>', 'set client\'s dbus name (default: spotify)', 'spotify')
  .option('--debug', 'enable debug output', false);

const commands = [
  {
    name: 'play',
    description: 'Play the current track',
    useCase: new PlayTrackUseCase(spotifyService),
  },
  {
    name: 'pause',
    description: 'Pause the current track',
    useCase: new PauseTrackUseCase(spotifyService),
  },
  {
    name: 'next',
    description: 'Play the next track',
    useCase: new NextTrackUseCase(spotifyService),
  },
  {
    name: 'prev',
    description: 'Play the previous track',
    useCase: new PreviousTrackUseCase(spotifyService),
  },
  {
    name: 'status',
    description: 'Show the current track status',
    useCase: new GetStatusUseCase(spotifyService),
  },
  {
    name: 'position',
    description: 'Show the current playback position',
    useCase: new GetPositionUseCase(spotifyService),
  },
  {
    name: 'playpause',
    description: 'Toggle between play and pause',
    useCase: new PlayPauseUseCase(spotifyService),
  },
  {
    name: 'song',
    description: 'Show the current song name',
    useCase: new GetTrackInfoUseCase(spotifyService, 'song'),
  },
  {
    name: 'songshort',
    description: 'Show the current song name (shortened)',
    useCase: new GetTrackInfoUseCase(spotifyService, 'songshort'),
  },
  {
    name: 'artist',
    description: 'Show the current artist name',
    useCase: new GetTrackInfoUseCase(spotifyService, 'artist'),
  },
  {
    name: 'artistshort',
    description: 'Show the current artist name (shortened)',
    useCase: new GetTrackInfoUseCase(spotifyService, 'artistshort'),
  },
  {
    name: 'album',
    description: 'Show the current album name',
    useCase: new GetTrackInfoUseCase(spotifyService, 'album'),
  },
  {
    name: 'arturl',
    description: 'Show the album art URL',
    useCase: new GetTrackInfoUseCase(spotifyService, 'arturl'),
  },
];

// Add a check command to test DBus connectivity with more detailed output
program
  .command('check')
  .description('Check if Spotify is properly connected via DBus')
  .action(async () => {
    try {
      // Enable debug for this command
      process.env.SPOTIFY_CLI_DEBUG = 'true';
      
      console.log('Testing DBus connection to Spotify...');
      const player = await spotifyService.getSpotifyPlayer();
      console.log('✓ Connection successful!');
      console.log('✓ Spotify client:', spotifyService.client);
      console.log('✓ DBus interface available:', player ? 'Yes' : 'No');
      
      // Test metadata access
      try {
        const metadata = await player.Metadata;
        console.log('✓ Metadata access:', metadata ? 'Available' : 'Not available');
        
        // Check specific metadata fields
        console.log('\nMetadata fields:');
        console.log('- xesam:title:', metadata['xesam:title'] ? '✓ Present' : '✗ Missing');
        console.log('- xesam:artist:', metadata['xesam:artist'] ? '✓ Present' : '✗ Missing');
        console.log('- xesam:album:', metadata['xesam:album'] ? '✓ Present' : '✗ Missing');
        
        // Test playback status
        const status = await player.PlaybackStatus;
        console.log('\nPlayback status:', status);
      } catch (metadataError) {
        console.log('✗ Metadata access failed:', metadataError.message);
        console.log('  This could indicate no song is playing or Spotify is not fully initialized.');
      }
      
      process.exit(0);
    } catch (error) {
      console.error('✗ Connection failed:', error.message);
      console.error('  Make sure Spotify is running and DBus is working correctly.');
      process.exit(1);
    }
  });

// Add a new command to quickly check if your song is playing
program
  .command('isplaying')
  .description('Check if a song is currently playing in Spotify')
  .action(async () => {
    try {
      process.env.SPOTIFY_CLI_DEBUG = 'true';
      console.log('Checking if Spotify is playing music...');
      
      const player = await spotifyService.getSpotifyPlayer();
      const status = await spotifyService.getPlaybackStatus();
      let metadata;

      try {
        metadata = await player.Metadata;
      } catch (error) {
        console.log('✗ Failed to retrieve metadata:', error.message);
        metadata = null;
      }
      
      console.log(`✓ Spotify connection: OK`);
      console.log(`✓ Playback status: ${status}`);
      
      if (status === 'Playing') {
        console.log('✓ Song is currently playing');
        
        if (metadata && metadata['xesam:title']) {
          console.log(`✓ Current track: "${metadata['xesam:title']}" by ${Array.isArray(metadata['xesam:artist']) ? metadata['xesam:artist'].join(', ') : 'Unknown'}`);
        } else {
          console.log('✗ No track metadata available despite playing status');
        }
      } else {
        console.log(`✗ Spotify is not currently playing music (status: ${status})`);
        console.log('  You need to play a song in Spotify first for most commands to work');
        console.log('  Try using "spotifycli play" to start playback');
      }
      
      process.exit(0);
    } catch (error) {
      console.error('✗ Error checking playback:', error.message);
      console.error('  Make sure Spotify is running before using this command');
      process.exit(1);
    }
  });

commands.forEach(({ name, description, useCase }) => {
  program
    .command(name)
    .description(description)
    .action(async () => {
      try {
        // Set the client name if provided
        const options = program.opts();
        if (options.client && spotifyService.setClient) {
          spotifyService.setClient(options.client);
        }
        
        // Set debug mode if requested
        if (options.debug) {
          process.env.SPOTIFY_CLI_DEBUG = 'true';
        }
        
        console.log(`Executing command: ${name}...`);
        
        // Adicionar espera para comandos que dependem de metadados
        if (['song', 'artist', 'album', 'arturl'].includes(name)) {
          console.log('Waiting for Spotify to update playback status and metadata...');
        }
        
        const result = await useCase.execute();
        if (result) {
          console.log(result);
        }
        process.exit(0);
      } catch (error) {
        console.error(`Error executing ${name}: ${error.message}`);
        
        if (error.message.includes('Failed to connect to Spotify')) {
          console.error('Make sure Spotify is running and try again.');
          console.error('Tip: You may need to use --client option if using a different Spotify client.');
        } else if (error.message.includes('No track metadata') || 
                  error.message.includes('Playback is stopped') ||
                  error.message.includes('Track information is incomplete')) {
          console.error('No song is currently playing or the track info is unavailable.');
          console.error('IMPORTANT: You must PLAY A SONG in Spotify first before using this command.');
          console.error('Try these steps:');
          console.error('1. Make sure Spotify is open');
          console.error('2. Play a song in Spotify');
          console.error('3. Run "spotifycli isplaying" to verify playback status');
          console.error('4. Then try this command again');
        }
        
        process.exit(1);
      }
    });
});

program.parse(process.argv);
