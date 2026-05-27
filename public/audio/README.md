# Demo audio

Audio files are intentionally not committed.

To try the recording-review screen with the Carl Jung interview URL Or suggested, install `yt-dlp` locally and place an MP3 here:

```bash
yt-dlp -x --audio-format mp3 -o public/audio/jung-interview.%(ext)s 'https://www.youtube.com/watch?v=2AMu-G51yTY'
```

Only use audio you have rights to use. The app expects `/audio/jung-interview.mp3` for the mocked recording examples.
