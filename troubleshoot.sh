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
echo "2. Checking if a song is playing..."
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
echo "3. Checking D-Bus connection..."
echo "Running diagnostic tool..."
node src/debug.js

echo
echo "4. Testing basic commands..."
echo "Trying to get status:"
node src/interface/cli.js --debug status || echo "Command failed"

echo
echo "5. Checking installation..."
echo "Which spotifycli is used: $(which spotifycli 2>/dev/null || echo "Not found in PATH")"

echo
echo "Common issues and solutions:"
echo "1. No track info available - Make sure a song is currently PLAYING in Spotify"
echo "2. Command not found - Make sure spotifycli is in your PATH or use absolute paths"
echo "3. Connection errors - Make sure Spotify is running and try restarting it"
echo "4. Client name issues - If you're using a different client, use --client option"
echo
echo "Quick fixes to try:"
echo "1. Play a song in Spotify first, then run your command"
echo "2. Restart Spotify completely"
echo "3. Run commands with explicit path: node $(pwd)/src/interface/cli.js"
echo "4. Run commands with --debug option for more information"
