import { expect, it } from 'vitest'
import { mediaProvider } from '../../packages/lumen-cms-shared/src/media'
import { canPlay } from '../../node_modules/react-player/dist/patterns.js'

it.each([
 'https://example.test/movie.m3u8?token=public', 'https://example.test/movie.mpd',
 'https://stream.mux.com/abcd', 'https://youtu.be/dQw4w9WgXcQ',
 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
 'https://vimeo.com/123456', 'https://vimeo.com/movie.mp4',
 'https://fast.wistia.net/embed/iframe/abc123', 'https://open.spotify.com/track/abc123',
 'https://www.twitch.tv/videos/12345', 'https://www.tiktok.com/@example/video/12345',
 'https://a.storyblok.com/f/123/movie.mp4', 'https://example.test/sound.mp3'
])('selects the legacy provider for %s', src => {
 const legacy = ['hls', 'dash', 'mux', 'youtube', 'vimeo', 'wistia', 'spotify', 'twitch', 'tiktok', 'html'].find(key => canPlay[key](src))
 const selected = mediaProvider(src)
 expect(selected === 'audio' || selected === 'video' ? 'html' : selected).toBe(legacy)
})
