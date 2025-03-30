#!/usr/bin/env node

import dbus from 'dbus-next';

async function inspectMetadata() {
  console.log('=== DBus Metadata Inspector ===');
  
  try {
    const bus = dbus.sessionBus();
    
    console.log('Connecting to Spotify...');
    const proxyObject = await bus.getProxyObject(
      'org.mpris.MediaPlayer2.spotify',
      '/org/mpris/MediaPlayer2'
    );
    
    console.log('Getting properties interface...');
    const properties = proxyObject.getInterface('org.freedesktop.DBus.Properties');
    
    console.log('Fetching metadata...');
    const metadata = await properties.Get('org.mpris.MediaPlayer2.Player', 'Metadata');
    
    console.log('\n=== Metadata Object ===');
    console.log(JSON.stringify(metadata, null, 2));
    
    console.log('\n=== Key Structure Analysis ===');
    for (const key in metadata) {
      const value = metadata[key];
      console.log(`Key: ${key}`);
      console.log(`  Type: ${Array.isArray(value) ? 'Array' : typeof value}`);
      
      if (Array.isArray(value)) {
        console.log(`  Array Length: ${value.length}`);
        for (let i = 0; i < value.length; i++) {
          console.log(`  [${i}]: ${typeof value[i]} = ${value[i]}`);
        }
      } else if (typeof value === 'object') {
        console.log(`  Object Properties: ${Object.keys(value).join(', ')}`);
      } else {
        console.log(`  Value: ${value}`);
      }
      console.log('---');
    }
    
    // Test extracting like Python would
    console.log('\n=== Testing Python-style Extraction ===');
    try {
      // Artist test
      console.log('=== Artist Extraction ===');
      if (metadata['xesam:artist']) {
        if (Array.isArray(metadata['xesam:artist'])) {
          console.log(`Artist as array:`, metadata['xesam:artist']);
          if (metadata['xesam:artist'][1]) {
            console.log(`Artist[1]: ${metadata['xesam:artist'][1]}`);
          }
          console.log(`Artist joined:`, metadata['xesam:artist'].join(', '));
        } else {
          console.log(`Artist direct value:`, metadata['xesam:artist']);
        }
      } else {
        console.log('Artist not available');
      }
      
      // Title test
      console.log('\n=== Title Extraction ===');
      if (metadata['xesam:title']) {
        if (Array.isArray(metadata['xesam:title'])) {
          console.log(`Title as array:`, metadata['xesam:title']);
          if (metadata['xesam:title'][1]) {
            console.log(`Title[1]: ${metadata['xesam:title'][1]}`);
          }
        } else {
          console.log(`Title direct value:`, metadata['xesam:title']);
        }
      } else {
        console.log('Title not available');
      }
      
      // Album test
      console.log('\n=== Album Extraction ===');
      if (metadata['xesam:album']) {
        if (Array.isArray(metadata['xesam:album'])) {
          console.log(`Album as array:`, metadata['xesam:album']);
          if (metadata['xesam:album'][1]) {
            console.log(`Album[1]: ${metadata['xesam:album'][1]}`);
          }
        } else {
          console.log(`Album direct value:`, metadata['xesam:album']);
        }
      } else {
        console.log('Album not available');
      }
      
    } catch (err) {
      console.log('Error during extraction tests:', err.message);
    }
    
    // Get playback status
    console.log('\n=== Playback Status ===');
    try {
      const status = await properties.Get('org.mpris.MediaPlayer2.Player', 'PlaybackStatus');
      console.log('Current status:', status);
    } catch (err) {
      console.log('Error getting playback status:', err.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Make sure Spotify is running and a song is playing.');
  }
}

inspectMetadata();
