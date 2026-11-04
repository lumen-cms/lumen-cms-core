// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializePlayers } from '../../packages/lumen-cms-astro/src/client/player'

vi.mock('../../packages/lumen-cms-astro/node_modules/hls-video-element', () => { throw new Error('Provider chunk unavailable') })
afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
 vi.restoreAllMocks()
 vi.unstubAllGlobals()
})
function setup() {
 vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
 vi.spyOn(console, 'error').mockImplementation(() => {})
 const section = document.createElement('section')
 const root = document.createElement('div')
 root.dataset.lmPlayer = ''
 root.dataset.playerConfig = JSON.stringify({ url: 'https://example.test/video.m3u8', disable_lazy_load: true })
 root.innerHTML = '<div class="lm-player-surface"></div>'
 section.append(root); document.body.append(section)
 const failure = vi.fn()
 section.addEventListener('lumen:media-error', failure)
 return { section, root, failure }
}
it('notifies the containing section when a provider module cannot load', async () => {
 const { root, failure } = setup()
 initializePlayers()
 await vi.waitFor(() => expect(root.dataset.playerReady).toBe('error'))
 expect(failure).toHaveBeenCalledTimes(1)
 expect(console.error).toHaveBeenCalled()
})
it('ignores provider failures after its containing block is unmounted', async () => {
 const { section, failure } = setup()
 initializePlayers()
 section.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 await new Promise(resolve => setTimeout(resolve, 20))
 expect(failure).not.toHaveBeenCalled()
 expect(console.error).not.toHaveBeenCalled()
})
it('keeps YouTube behind a preview even when lazy loading and light mode are disabled', async () => {
 const { root } = setup()
 root.dataset.playerConfig = JSON.stringify({ url: 'https://www.youtube.com/watch?v=f5h2j0juYIs', disable_lazy_load: true, light: false, playing: true })
 const fetch = vi.fn()
 vi.stubGlobal('fetch', fetch)
 initializePlayers()
 await vi.waitFor(() => expect(root.dataset.playerReady).toBe('preview'))
 expect(root.querySelector('youtube-video, iframe')).toBeNull()
 expect(root.querySelector('button')?.style.backgroundImage).toContain('i.ytimg.com/vi/f5h2j0juYIs/hqdefault.jpg')
 expect(fetch).not.toHaveBeenCalled()
})
