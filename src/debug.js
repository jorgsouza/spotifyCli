#!/usr/bin/env node

import dbus from 'dbus-next';
import { execSync } from 'child_process';

async function checkDBusServices() {
  console.log('=== Spotify CLI Diagnostics ===');
  console.log('Checking system and DBus services...');
  
  try {
    // Check if D-Bus is working
    console.log('\n1. D-Bus Status:');
    try {
      const bus = dbus.sessionBus();
      console.log('✓ D-Bus session bus is accessible');
      
      const names = await bus.listNames();
      console.log('✓ Successfully retrieved list of D-Bus services');
      
      // Check specifically for media player services
      const mediaServices = names.filter(name => name.includes('org.mpris.MediaPlayer2'));
      console.log(`\n2. Media Players Available (${mediaServices.length}):`);
      
      if (mediaServices.length === 0) {
        console.log('✗ No media players found on D-Bus');
        console.log('  This suggests no compatible media players are running.');
      } else {
        mediaServices.forEach(name => {
          console.log('- ' + name);
        });
      }
      
      // Check specifically for Spotify
      console.log('\n3. Spotify Status:');
      if (names.includes('org.mpris.MediaPlayer2.spotify')) {
        console.log('✓ Spotify is available on D-Bus');
        
        try {
          const proxyObject = await bus.getProxyObject(
            'org.mpris.MediaPlayer2.spotify',
            '/org/mpris/MediaPlayer2'
          );
          
          // Get interfaces
          const interfaces = proxyObject._interfaces;
          console.log('✓ Available interfaces:', Object.keys(interfaces).join(', '));
          
          // Check if player interface exists
          if (interfaces['org.mpris.MediaPlayer2.Player']) {
            console.log('✓ Player interface is available');
            
            const player = proxyObject.getInterface('org.mpris.MediaPlayer2.Player');
            
            // Try to get playback status
            try {
              const status = await player.PlaybackStatus;
              console.log(`✓ Playback status: ${status}`);
            } catch (err) {
              console.log('✗ Could not get playback status:', err.message);
            }
            
            // Try to get metadata
            try {
              const metadata = await player.Metadata;
              console.log('✓ Metadata is available');
              
              // Check essential metadata fields
              console.log('\n4. Track Metadata:');
              if (!metadata || Object.keys(metadata).length === 0) {
                console.log('✗ Metadata object is empty');
              } else {
                console.log('- Artist:', metadata['xesam:artist'] ? 
                    (Array.isArray(metadata['xesam:artist']) ? 
                        metadata['xesam:artist'].join(', ') : metadata['xesam:artist']) : 
                    '✗ Missing');
                console.log('- Title:', metadata['xesam:title'] || '✗ Missing');
                console.log('- Album:', metadata['xesam:album'] || '✗ Missing');
                console.log('- Track ID:', metadata['mpris:trackid'] || '✗ Missing');
                console.log('- Length:', metadata['mpris:length'] || '✗ Missing');
              }
            } catch (err) {
              console.log('✗ Could not get metadata:', err.message);
              console.log('  This likely means no track is currently playing.');
            }
            
          } else {
            console.log('✗ Player interface is not available');
          }
          
        } catch (error) {
          console.log('✗ Error accessing Spotify on D-Bus:', error.message);
        }
      } else {
        console.log('✗ Spotify is NOT available on D-Bus');
        console.log('  Make sure Spotify is running.');
      }
      
    } catch (dbusError) {
      console.log('✗ D-Bus connection failed:', dbusError.message);
    }
    
    // Check for running processes
    console.log('\n5. Spotify Process:');
    try {
      const spotifyProcess = execSync('ps aux | grep -i spotify | grep -v grep').toString().trim();
      console.log('✓ Spotify process found:');
      
      // Show a simplified version of the process info
      spotifyProcess.split('\n').forEach(line => {
        const parts = line.split(/\s+/);
        // Format: username, pid, command
        if (parts.length >= 11) {
          console.log(`- User: ${parts[0]}, PID: ${parts[1]}, Command: ${parts.slice(10).join(' ').substring(0, 50)}...`);
        } else {
          console.log(`- ${line.substring(0, 100)}...`);
        }
      });
    } catch (e) {
      console.log('✗ No Spotify process found. Spotify is not running.');
    }
    
    // Environment information
    console.log('\n6. Environment Info:');
    console.log('- Node.js version:', process.version);
    console.log('- Platform:', process.platform);
    
    console.log('\n=== Diagnosis Summary ===');
    if (!names.includes('org.mpris.MediaPlayer2.spotify')) {
      console.log('ISSUE: Spotify is not available on D-Bus.');
      console.log('SOLUTION: Start Spotify and make sure it has D-Bus integration enabled.');
    } else if (!metadata || !metadata['xesam:title']) {
      console.log('ISSUE: No track is currently playing or metadata is unavailable.');
      console.log('SOLUTION: Play a track in Spotify and try again.');
    } else {
      console.log('No obvious issues detected. If you are still experiencing problems:');
      console.log('1. Try restarting Spotify');
      console.log('2. Ensure you are using the correct client name with --client option');
      console.log('3. Check that your Spotify client supports the MPRIS D-Bus interface');
    }
    
  } catch (error) {
    console.error('\nError during diagnostics:', error);
  }
}

checkDBusServices();
