#!/bin/bash

echo "=== Spotify CLI Troubleshooting Helper ==="
echo "This script will help identify issues with spotify-cli-linux"
echo

echo "1. Checking if Spotify is running..."
if ps aux | grep -q "[s]potify"; then
  echo "✓ Spotify is running"
else
  echo "✗ Spotify is not running. Please start Spotify first."
  exit 1
fi

echo
echo "2. Checking Node.js version..."
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "✓ Node.js is installed: $NODE_VERSION"
  if [[ "${NODE_VERSION//v/}" < "14" ]]; then
    echo "✗ Warning: This application requires Node.js 14+. Please upgrade."
  fi
else
  echo "✗ Node.js not found. Please install Node.js 14 or newer."
  exit 1
fi

echo
echo "3. Checking if a song is playing..."
PLAYBACK=$(node src/interface/cli.js --debug isplaying 2>&1) || echo "Failed to check playback status"
echo "$PLAYBACK"

if [[ "$PLAYBACK" == *"Song is currently playing"* ]]; then
  echo "✓ Song is playing - that's good!"
else
  echo "✗ No song appears to be playing"
  echo "  IMPORTANT: Most commands require an active song playing in Spotify"
  echo "  Please play a song in Spotify and try again"
fi

echo
echo "4. Analyzing DBus metadata format..."
echo "This will help diagnose metadata structure differences:"
node src/debug-metadata.js

echo
echo "5. Testing core functionality..."
echo "Directly testing metadata access:"
node -e "
const dbus = require('dbus-next');
async function test() {
  try {
    const bus = dbus.sessionBus();
    const proxyObject = await bus.getProxyObject(
      'org.mpris.MediaPlayer2.spotify',
      '/org/mpris/MediaPlayer2'
    );
    const props = proxyObject.getInterface('org.freedesktop.DBus.Properties');
    const metadata = await props.Get('org.mpris.MediaPlayer2.Player', 'Metadata');
    console.log('✓ Successfully got metadata');
    
    const title = metadata['xesam:title'];
    console.log('Title:', title);
    
    const artist = metadata['xesam:artist'];
    console.log('Artist:', Array.isArray(artist) ? artist.join(', ') : artist);
    
  } catch (err) {
    console.error('✗ Error:', err.message);
  }
}
test();
"

echo
echo "6. Testing song and artist commands..."
echo "Trying to get song info:"
node src/interface/cli.js --debug song || echo "Command failed"
echo "Trying to get artist info:"
node src/interface/cli.js --debug artist || echo "Command failed"

echo
echo "7. Checking installation..."
echo "Which spotifycli is used: $(which spotifycli 2>/dev/null || echo "Not found in PATH")"

echo
echo "Common issues and solutions:"
echo "1. No track info available - Make sure a song is currently PLAYING in Spotify"
echo "2. Command not found - Make sure spotifycli is in your PATH or use absolute paths"
echo "3. Connection errors - Make sure Spotify is running and try restarting it"
echo "4. Client name issues - If you're using a different client, use --client option"
echo "5. Metadata format differences - DBus metadata format might vary between distros/versions"
echo
echo "Quick fixes to try:"
echo "1. Play a song in Spotify first, then run your command"
echo "2. Restart Spotify completely and make sure a song is playing before running commands"
echo "3. Run commands with explicit path: node $(pwd)/src/interface/cli.js"
echo "4. Run commands with --debug option for more information" 
echo "5. Try running with sudo if you have permission issues: sudo $(which spotifycli)"
