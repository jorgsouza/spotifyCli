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
import { GetTrackInfoUseCase, GetTrackInfoCommand } from '../application/usecases/GetTrackInfoUseCase.js';
import readline from 'readline';

// Only show version in standard mode
if (process.env.SPOTIFY_CLI_DEBUG !== 'true') {
  // console.log('Spotify CLI for Linux v1.9.2');
}

const program = new Command();
const spotifyService = new DBusSpotifyService();

// Add global options
program
  .option('--client <name>', 'set client\'s dbus name (default: spotify)', 'spotify')
  .option('--debug', 'enable debug output', false)
  .version('1.9.2');

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

// Add help command
program
  .command('help')
  .description('Show help information')
  .action(() => {
    program.outputHelp();
    process.exit(0);
  });

// Interactive shell mode function
async function startShellMode() {
  console.log('Spotify CLI Shell Mode');
  console.log('Type a command or "exit" to quit. Type "help" for available commands.');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'spotify > '
  });
  
  // Set up client options from any command line arguments
  const options = program.opts();
  if (options.client && spotifyService.setClient) {
    spotifyService.setClient(options.client);
  }
  
  // Set debug mode if requested
  if (options.debug) {
    process.env.SPOTIFY_CLI_DEBUG = 'true';
  }
  
  rl.prompt();
  
  rl.on('line', async (line) => {
    const command = line.trim();
    
    if (command === 'exit' || command === 'quit') {
      console.log('Goodbye!');
      rl.close();
      process.exit(0);
    } else if (command === 'help') {
      console.log('Available commands:');
      commands.forEach(cmd => {
        console.log(`- ${cmd.name}: ${cmd.description}`);
      });
      console.log('- check: Check if Spotify is properly connected via DBus');
      console.log('- isplaying: Check if a song is currently playing');
      console.log('- exit: Exit the shell');
      console.log('- help: Show this help');
    } else {
      // Find the command
      const cmdConfig = commands.find(cmd => cmd.name === command);
      
      if (cmdConfig) {
        try {
          const result = await cmdConfig.useCase.execute();
          if (result) {
            console.log(result);
          }
        } catch (error) {
          console.error(`Error: ${error.message}`);
          
          // Show helpful error messages
          if (error.message.includes('Failed to connect to Spotify') ||
              error.message.includes('No track metadata') || 
              error.message.includes('Playback is stopped') ||
              error.message.includes('Track information is incomplete')) {
            console.error('Make sure Spotify is running and a song is playing.');
          }
        }
      } else if (command) {
        console.error(`Unknown command: ${command}. Type "help" for available commands.`);
      }
    }
    
    rl.prompt();
  });
  
  rl.on('close', () => {
    console.log('Have a nice day!');
    process.exit(0);
  });
}

commands.forEach(({ name, description, useCase }) => {
  program
    .command(name)
    .description(description)
    .action(async () => {
      try {
        const options = program.opts();
        if (options.client && spotifyService.setClient) {
          spotifyService.setClient(options.client);
        }
        if (options.debug) {
          process.env.SPOTIFY_CLI_DEBUG = 'true';
        }
        const result = await useCase.execute();
        if (result) {
          console.log(result);
        }
        process.exit(0);
      } catch (error) {
        console.error(`Error executing ${name}: ${error.message}`);
        if (error.message.includes('No metadata available')) {
          console.error('Make sure Spotify is running and a song is playing.');
        }
        process.exit(1);
      }
    });
});

// Check if no arguments were provided
if (process.argv.length === 2) {
  // Start interactive shell mode
  startShellMode();
} else {
  // Parse command line arguments
  program.parse(process.argv);
}
