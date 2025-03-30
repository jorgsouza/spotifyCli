# spotify-cli-linux

[![Version](https://img.shields.io/npm/v/spotify-cli-linux.svg)](https://www.npmjs.com/package/spotify-cli-linux)

A command line interface to [Spotify](https://www.spotify.com/) on Linux, built with Node.js.

If you're using macOS, see [spotify-cli-macos](https://github.com/pwittchen/spotify-cli-macos).

## Installation

```bash
# Local installation
npm install spotify-cli-linux

# Global installation
npm install -g spotify-cli-linux
```

Alternatively, you can clone the repository and create a symbolic link:

```bash
git clone https://github.com/[username]/spotify-cli-linux.git
cd spotify-cli-linux
npm install
npm link
```

## Usage

Start the official Spotify desktop app, then run the following command from your terminal:

```bash
spotifycli
```

### Command Line Options

```
-h, --help            Show help information
--version             Show version number
--status              Show current song status
--statusshort         Show status in a short way
--statusposition      Show song name and artist, with current playback position
--song                Show the song name
--songshort           Show the song name in a short way
--artist              Show artists name
--artistshort         Show artist name in a short way
--album               Show album name
--arturl              Show album image url
--lyrics              Show lyrics for the song playing (currently unimplemented)
--playbackstatus      Show playback status
--position            Show song position
--play                Play the song
--pause               Pause the song
--playpause           Play or pause the song (toggles state)
--next                Play the next song
--prev                Play the previous song
--songuri <uri>       Play the track at the provided Uri
--listuri <uri>       Play the playlist at the provided Uri
--client <name>       Set client's dbus name (default: spotify)
```

If you don't use any parameters, you'll enter the shell mode, where you'll be able to use all commands mentioned above interactively.

## Shell Mode

When you run `spotifycli` without arguments, you enter an interactive shell mode where you can execute commands continuously without having to prefix with `spotifycli`. Type `help` to see a list of available commands.

## Examples

```bash
spotifycli --status
# Output: Artist - Song title

spotifycli --songuri spotify:track:3vkQ5DAB1qQMYO4Mr9zJN6
# Plays the specified track

spotifycli --statusposition
# Output: Artist - Song title [1:23/4:56]
```

## Requirements

- Node.js 14+
- Running Spotify desktop client
- Linux operating system with DBus

## Troubleshooting

If you encounter an error like 'Failed to get Spotify player interface', make sure:
1. The Spotify desktop application is running
2. DBus is operational on your system

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
