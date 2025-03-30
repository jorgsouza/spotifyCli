# Common Issues and Solutions for Spotify CLI

## "No track metadata available" or "No song is currently playing"

This is the most common issue and happens when:
- Spotify isn't playing any track
- Spotify is paused
- Spotify has just started and hasn't loaded metadata yet

**Solution:**
1. Open Spotify desktop app
2. Play a song (not just load it, but actually start playing it)
3. Wait a few seconds for metadata to load
4. Try your command again

## Commands that always work even without a playing track:
- `spotifycli play` - Start playback
- `spotifycli pause` - Pause playback
- `spotifycli next` - Skip to next track
- `spotifycli prev` - Go to previous track
- `spotifycli check` - Check connection to Spotify
- `spotifycli isplaying` - Check if a song is playing

## Commands that require an active playing track:
- `spotifycli song` - Show current song name
- `spotifycli artist` - Show current artist name
- `spotifycli album` - Show current album name
- `spotifycli arturl` - Show album art URL
- `spotifycli position` - Show playback position
- `spotifycli status` - Show status information

## Troubleshooting Checklist:
1. Is Spotify running? ➜ If not, start Spotify
2. Is a song playing? ➜ If not, play a song
3. Is Spotify freshly started? ➜ Wait a few seconds for it to initialize
4. Are you using a custom client? ➜ Use `--client` option
5. Still not working? ➜ Run `npm run troubleshoot` for detailed diagnostics

## Quick Commands:
```bash
# Check if Spotify is properly connected
spotifycli check

# Check if a song is playing
spotifycli isplaying

# Run diagnostics
npm run troubleshoot

# Debug a specific command
spotifycli --debug song
```

Remember: Most commands require an active track playing in Spotify to work properly!
