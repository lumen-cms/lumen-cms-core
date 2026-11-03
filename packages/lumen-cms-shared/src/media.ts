import * as patterns from './vendor/media-patterns'

/** Preserve ReactPlayer's provider precedence for the resolved CMS source. */
export function mediaProvider(src: string) {
 if (patterns.HLS_EXTENSIONS.test(src)) return 'hls'
 if (patterns.DASH_EXTENSIONS.test(src)) return 'dash'
 if (patterns.MATCH_URL_MUX.test(src)) return 'mux'
 if (patterns.MATCH_URL_YOUTUBE.test(src)) return 'youtube'
 if (patterns.MATCH_URL_VIMEO.test(src) && !patterns.VIDEO_EXTENSIONS.test(src)) return 'vimeo'
 if (patterns.MATCH_URL_WISTIA.test(src)) return 'wistia'
 if (patterns.MATCH_URL_SPOTIFY.test(src)) return 'spotify'
 if (patterns.MATCH_URL_TWITCH.test(src)) return 'twitch'
 if (patterns.MATCH_URL_TIKTOK.test(src)) return 'tiktok'
 return patterns.AUDIO_EXTENSIONS.test(src) ? 'audio' : 'video'
}
