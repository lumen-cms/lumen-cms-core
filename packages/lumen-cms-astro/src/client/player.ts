import { youtubeVideoId } from '../lib/youtube'
import { onUnmount } from './lifecycle'
import type { PlayerStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import videoUrlHelper from 'lumen-cms-shared/core/utils/videoUrlHelper'
import { mediaProvider } from 'lumen-cms-shared/media'

const providers = {
 hls: { tag: 'hls-video', load: () => import('hls-video-element') },
 dash: { tag: 'dash-video', load: () => import('dash-video-element') },
 mux: { tag: 'mux-player', load: () => import('@mux/mux-player') },
 youtube: { tag: 'youtube-video', load: () => import('youtube-video-element') },
 vimeo: { tag: 'vimeo-video', load: () => import('vimeo-video-element') },
 wistia: { tag: 'wistia-video', load: () => import('wistia-video-element') },
 spotify: { tag: 'spotify-audio', load: () => import('spotify-audio-element') },
 twitch: { tag: 'twitch-video', load: () => import('twitch-video-element') },
 tiktok: { tag: 'tiktok-video', load: () => import('tiktok-video-element') }
}
const thumbnails = new Map<string, string>()
export function initializePlayers() {
 document.querySelectorAll<HTMLElement>('[data-lm-player]:not([data-player-ready])').forEach(root => {
  root.dataset.playerReady = 'pending'
  const content: PlayerStoryblok = JSON.parse(root.dataset.playerConfig!)
  const surface = root.querySelector<HTMLElement>('.lm-player-surface')!
  let media: HTMLMediaElement | undefined, hovered = false, active = false, disposed = false, userStarted = false
  const reportError = () => { if (!disposed) root.dispatchEvent(new CustomEvent('lumen:media-error', { bubbles: true })) }
  const playback = () => {
   if (!media) return
   const playing = (userStarted || !!content.playing) !== (!!content.toggle_play_on_hover && hovered)
   if (playing) void media.play()?.catch(() => {})
   else media.pause()
  }
  surface.addEventListener('mouseenter', () => { hovered = true; playback() })
  surface.addEventListener('mouseleave', () => { hovered = false; playback() })
  const mount = async (src: string) => {
   try {
    const provider = mediaProvider(src)
    let tag: string = provider
    if (provider !== 'audio' && provider !== 'video') { const selected = providers[provider]; await selected.load(); tag = selected.tag; await customElements.whenDefined(tag) }
    if (disposed) return
    media = document.createElement(tag) as HTMLMediaElement
    media.className = 'lm-player-media'
    for (const [attribute, enabled] of Object.entries({ controls: content.controls, muted: content.muted, loop: content.loop, playsinline: content.playsinline, autoplay: userStarted || content.playing })) if (enabled) media.setAttribute(attribute, '')
    media.volume = content.muted ? 0 : Math.max(0, Math.min(1, Number(content.volume || 0)))
    media.muted = !!content.muted
    media.addEventListener('loadstart', playback)
    media.addEventListener('error', reportError)
    media.src = src
    surface.replaceChildren(media)
    root.dataset.playerReady = 'active'
    playback()
   } catch (error) {
    if (disposed) return
    root.dataset.playerReady = 'error'
    reportError()
    console.error('Unable to load media player', error)
   }
  }
  const activate = async () => {
   if (active) return
   active = true
   const { src } = videoUrlHelper(content, true)
   if (!src) { root.dataset.playerReady = 'empty'; return }
   const youtubeId = youtubeVideoId(src)
   if (!content.light && !youtubeId) { await mount(src); return }
   const preview = document.createElement('button')
   preview.type = 'button'; preview.className = 'lm-player-preview'; preview.setAttribute('aria-label', 'Load video')
   const shadow = document.createElement('span'); shadow.className = 'lm-player-shadow'
   const icon = document.createElement('span'); icon.className = 'lm-player-play-icon'; shadow.append(icon); preview.append(shadow)
   const showImage = (url: string) => { preview.style.backgroundImage = `url(${JSON.stringify(url)})` }
   if (content.fallback_image) showImage(content.fallback_image)
   else if (youtubeId) showImage(`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`)
   else if (thumbnails.has(src)) showImage(thumbnails.get(src)!)
   else void fetch(`https://noembed.com/embed?url=${encodeURIComponent(src)}`).then(response => { if (!response.ok) throw new Error(`Thumbnail request failed: ${response.status}`); return response.json() }).then(data => { if (data.thumbnail_url) { const image = String(data.thumbnail_url).replace('height=100', 'height=480').replace('-d_295x166', '-d_640'); thumbnails.set(src, image); if (!disposed) showImage(image) } }).catch(() => {})
   preview.addEventListener('click', () => { preview.disabled = true; userStarted = true; void mount(src) }, { once: true })
   surface.replaceChildren(preview); root.dataset.playerReady = 'preview'
  }
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void activate() } }, { rootMargin: '400px 0px' })
  if (content.disable_lazy_load) void activate()
  else observer.observe(root)
  onUnmount(root, () => { disposed = true; observer.disconnect(); media?.pause() })
 })
}
